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
  const { content, disabled } = props

  const [isSelected, setSelection] = useState(false)

  const { Components } = useTheme()

  return (
    <View>
      <View style={Components.checkbox.checkboxContainer}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={Components.checkbox.checkbox}
          disabled={disabled}
          tintColors={Components.checkbox.tintColors(disabled)}
        />
        <Text style={Components.checkbox.label(disabled)}>{content}</Text>
      </View>
    </View>
  )
}

export default Checkbox
