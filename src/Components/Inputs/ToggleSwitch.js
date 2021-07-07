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
    Components: { toggleSwitch },
    Colors,
  } = useTheme()

  return (
    <View style={toggleSwitch.wrapper}>
      <Text style={toggleSwitch.label}>{label}</Text>
      <View style={toggleSwitch.switchContainer}>
        <Switch
          trackColor={{ false: Colors.grey, true: Colors.primary }}
          thumbColor={Colors.red}
          onValueChange={handleToggle}
          value={value}
        />
      </View>
    </View>
  )
}

export default ToggleSwitch
