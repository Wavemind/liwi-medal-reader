/**
 * The external imports
 */
import React, { useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const Select = ({ question, disabled }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Components: { select },
    Colors,
  } = useTheme()

  // Local state definition
  const [value, setValue] = useState(question.answer)
  console.log(value)

  const setAnswer = answerId => {
    setValue(answerId)
  }

  return (
    <View style={select.pickerContainer(disabled)}>
      <Picker
        style={select.picker}
        mode="dropdown"
        selectedValue={value}
        onValueChange={(answerId, itemIndex) => setAnswer(answerId)}
        dropdownIconColor={Colors.primary}
        enabled={!disabled}
      >
        <Picker.Item
          key="select-placeholder"
          label={t('actions.select')}
          value={null}
        />
        {Object.keys(question.answers).map(answerId => (
          <Picker.Item
            key={`select-${answerId}`}
            label={translate(question.answers[answerId].label)}
            value={String(answerId)}
          />
        ))}
      </Picker>
    </View>
  )
}

export default Select
