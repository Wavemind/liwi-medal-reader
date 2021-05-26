/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Select = props => {
  // Props deconstruction
  const { label, items, warning, disabled } = props

  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Components: { select },
    Colors,
  } = useTheme()

  // Local state definition
  const [awesome, setAwesome] = useState('')

  return (
    <View style={select.wrapper(warning)}>
      <Text style={select.label(warning)}>{label}</Text>
      <View style={select.pickerContainer(disabled)}>
        <Picker
          style={select.picker}
          mode="dropdown"
          selectedValue={awesome}
          onValueChange={(itemValue, itemIndex) => setAwesome(itemValue)}
          dropdownIconColor={Colors.primary}
          enabled={!disabled}
        >
          <Picker.Item
            key="select-placeholder"
            label={t('actions.select')}
            value=""
          />
          {items.map(item => {
            return (
              <Picker.Item
                key={`select-${item.value}`}
                label={item.label}
                value={item.value}
              />
            )
          })}
        </Picker>
      </View>
    </View>
  )
}

export default Select
