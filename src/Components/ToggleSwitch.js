/**
 * The external imports
 */
import React from 'react'
import { Text, View, Switch } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const ToggleSwitch = props => {
  // Props deconstruction
  const { label, handleToggle, value } = props

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
          trackColor={{ false: '#767577', true: '#f4f3f4' }}
          thumbColor={value ? Colors.primary : '#f4f3f4'}
          onValueChange={handleToggle}
          value={value}
        />
      </View>
    </View>
  )
}

export default ToggleSwitch
