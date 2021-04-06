/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const SquareButton = props => {
  const { content, filled, disabled } = props
  const type = filled ? 'filled' : 'outlined'

  const { Components } = useTheme()

  const handlePress = () => {
    console.log('button pressed')
  }

  return (
    <View style={Components.squareButton.wrapper}>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={Components.squareButton[type](disabled)}
        disabled={disabled}
      >
        <Text style={Components.squareButton[`${type}Text`]}>{content}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SquareButton
