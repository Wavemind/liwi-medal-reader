/**
 * The external imports
 */
import React from 'react'
import { Text, View, Switch } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const ToggleSwitch = ({ label, handleToggle, value }) => {
  // Theme and style elements deconstruction
  const {
    Components: { squareSelect },
    Colors,
  } = useTheme()

  return (
    <View style={squareSelect.wrapper}>
      <Text style={squareSelect.label}>{label}</Text>
      <View style={squareSelect.pickerContainer}>
        <Switch
          trackColor={{ false: Colors.grey, true: Colors.secondary }}
          thumbColor={value ? Colors.primary : Colors.secondary}
          onValueChange={handleToggle}
          value={value}
        />
      </View>
    </View>
  )
}

export default ToggleSwitch
