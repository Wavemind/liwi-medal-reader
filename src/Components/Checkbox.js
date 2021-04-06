/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Checkbox = props => {
  // Props deconstruction
  const { content, disabled } = props

  // Theme and style elements deconstruction
  const {
    Components: { checkbox },
  } = useTheme()

  // Local state definition
  const [isSelected, setSelection] = useState(false)

  return (
    <View style={checkbox.checkboxContainer}>
      <CheckBox
        value={isSelected}
        onValueChange={setSelection}
        style={checkbox.checkbox}
        disabled={disabled}
        tintColors={checkbox.tintColors(disabled)}
      />
      <Text style={checkbox.label(disabled)}>{content}</Text>
    </View>
  )
}

export default Checkbox
