/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Select = props => {
  // Props deconstruction
  const { items } = props

  // Theme and style elements deconstruction
  const {
    Components: { select },
  } = useTheme()

  // Local state definition
  const [awesome, setAwesome] = useState('')

  return (
    <View style={select.wrapper}>
      <Text style={select.label}>Select how awesome I am</Text>
      <DropDownPicker
        items={items}
        defaultValue={awesome}
        containerStyle={select.pickerContainer}
        style={select.pickerWrapperStyle}
        itemStyle={select.pickerItem}
        dropDownStyle={select.pickerDropDown}
        onChangeItem={item => setAwesome(item.value)}
      />
    </View>
  )
}

export default Select
