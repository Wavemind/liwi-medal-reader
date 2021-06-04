/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Checkbox = ({
  label,
  onPress = () => console.log('Add action !'),
  defaultValue = false,
  nodeId = null,
  disabled = false,
}) => {
  // Theme and style elements deconstruction
  const {
    Components: { checkbox },
  } = useTheme()

  // Local state definition
  const [isSelected, setSelection] = useState(defaultValue)

  useEffect(() => {
    setSelection(defaultValue)
  }, [defaultValue])

  /**
   * OnPress action
   */
  const handleOnPress = () => {
    setSelection(!isSelected)
    onPress(!isSelected, nodeId)
  }

  return (
    <TouchableOpacity
      style={checkbox.checkboxContainer}
      onPress={handleOnPress}
      disabled={disabled}
    >
      <CheckBox
        value={isSelected}
        style={checkbox.checkbox}
        onChange={handleOnPress}
        tintColors={checkbox.tintColors(disabled)}
        onChange={handleOnPress}
      />
      <Text style={checkbox.label(disabled)}>{label}</Text>
    </TouchableOpacity>
  )
}

export default Checkbox
