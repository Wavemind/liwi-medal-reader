/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import setAnswer from '@/Utils/SetAnswer'
import { translate } from '@/Translations/algorithm'

const Select = ({ questionId, disabled = false }) => {
  // Theme and style elements deconstruction
  const {
    Components: { select },
    Colors,
  } = useTheme()

  const { t } = useTranslation()

  // Get node from algorithm
  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [value, setValue] = useState(question.answer)

  useEffect(() => {
    if (Object.values(currentNode.answers).length === 1) {
      setValue(Object.values(currentNode.answers)[0].id)
    }
  }, [])

  /**
   * Set answer in medical case
   */
  const setLocalAnswer = answerId => {
    setValue(answerId)
  }

  /**
   * Update value in store when value changes
   */
  useEffect(() => {
    if (question.answer !== value) {
      setAnswer(question.id, value)
    }
  }, [value])

  return (
    <View style={select.pickerContainer(disabled)}>
      <Picker
        style={select.picker}
        selectedValue={value}
        prompt={translate(currentNode.label)}
        onValueChange={setLocalAnswer}
        dropdownIconColor={Colors.primary}
        enabled={!disabled}
      >
        <Picker.Item
          key="select-placeholder"
          label={t('actions.select')}
          value={null}
        />
        {Object.values(currentNode.answers).map(answer => (
          <Picker.Item
            key={`select-${answer.id}`}
            label={translate(answer.label)}
            value={answer.id}
          />
        ))}
      </Picker>
    </View>
  )
}

export default Select
