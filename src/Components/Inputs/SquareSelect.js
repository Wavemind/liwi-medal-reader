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

const SquareSelect = ({
  label,
  prompt,
  items,
  handleOnSelect,
  value,
  withBorder = false,
  fullWidth = true,
  pickerGrow = false,
}) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Fonts,
    Components: { squareSelect },
  } = useTheme()

  const { t } = useTranslation()

  return (
    <View style={squareSelect.wrapper(fullWidth, label)}>
      {label && <Text style={squareSelect.label}>{label}</Text>}
      <View style={squareSelect.pickerContainer(withBorder, pickerGrow)}>
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
            color={Colors.grey}
            style={Fonts.textSmall}
            fontFamily="ZeitungPro"
          />
          {items.map(item => {
            return (
              <Picker.Item
                key={`select-${item.value}`}
                label={item.label}
                value={item.value}
                style={Fonts.textSmall}
                fontFamily="ZeitungPro"
              />
            )
          })}
        </Picker>
      </View>
    </View>
  )
}

export default SquareSelect
