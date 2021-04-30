/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Select = props => {
  // Props deconstruction
  const { label, items } = props

  // Theme and style elements deconstruction
  const {
    Components: { squareSelect },
    Colors,
  } = useTheme()

  // Local state definition
  const [awesome, setAwesome] = useState('')

  return (
    <View style={squareSelect.wrapper}>
      <Text style={squareSelect.label}>{label}</Text>
      <View style={squareSelect.pickerContainer}>
        <Picker
          style={squareSelect.picker}
          mode="dropdown"
          selectedValue={awesome}
          onValueChange={(itemValue, itemIndex) => setAwesome(itemValue)}
          dropdownIconColor={Colors.black}
        >
          <Picker.Item key="select-placeholder" label="Select..." value="" />
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
