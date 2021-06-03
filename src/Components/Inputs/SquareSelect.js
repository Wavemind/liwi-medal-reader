/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const SquareSelect = ({ label, prompt, items, handleOnSelect, value }) => {
  const { t } = useTranslation()

  // Theme and style elements deconstruction
  const {
    Components: { squareSelect },
    Colors,
  } = useTheme()

  return (
    <View style={squareSelect.wrapper}>
      <Text style={squareSelect.label}>{label}</Text>
      <View style={squareSelect.pickerContainer}>
        <Picker
          style={squareSelect.picker}
          prompt={prompt}
          selectedValue={value}
          onValueChange={(itemValue, itemIndex) => handleOnSelect(itemValue)}
          dropdownIconColor={Colors.primary}
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

export default SquareSelect
