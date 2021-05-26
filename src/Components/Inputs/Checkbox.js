/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Checkbox = ({ label, disabled }) => {
  // Theme and style elements deconstruction
  const {
    Components: { checkbox },
  } = useTheme()

  // Local state definition
  const [isSelected, setSelection] = useState(false)

  return (
    <TouchableOpacity
      style={checkbox.checkboxContainer}
      onPress={() => setSelection(!isSelected)}
      disabled={disabled}
    >
      <CheckBox
        value={isSelected}
        style={checkbox.checkbox}
        tintColors={checkbox.tintColors(disabled)}
      />
      <Text style={checkbox.label(disabled)}>{label}</Text>
    </TouchableOpacity>
  )
}

export default Checkbox
