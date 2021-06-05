/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'
import { translate } from '@/Translations/algorithm'

const Select = ({ questionId, disabled = false }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    Components: { select },
    Colors,
  } = useTheme()

  // Get node from algorithm
  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [value, setValue] = useState(question.answer)

  /**
   * Set answer in medical case
   */
  const setAnswer = answerId => {
    setValue(answerId)
  }

  /**
   * Update value in store when value changes
   */
  useEffect(() => {
    if (question.value !== value) {
      dispatch(SetAnswer.action({ nodeId: question.id, value }))
    }
  }, [value])

  return (
    <View style={select.pickerContainer(disabled)}>
      <Picker
        style={select.picker}
        selectedValue={value}
        prompt={translate(currentNode.label)}
        onValueChange={(answerId, itemIndex) => setAnswer(answerId)}
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
