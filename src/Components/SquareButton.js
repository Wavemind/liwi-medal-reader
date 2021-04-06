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
  // Props deconstruction
  const { content, filled, disabled } = props

  // Theme and style elements deconstruction
  const {
    Components: { squareButton },
  } = useTheme()

  // Constants definition
  const type = filled ? 'filled' : 'outlined'

  /**
   * Handles the press action on the TouchableOpacity
   */
  const handlePress = () => {
    console.log('button pressed')
  }

  return (
    <View style={squareButton.wrapper}>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={squareButton[type](disabled)}
        disabled={disabled}
      >
        <Text style={squareButton[`${type}Text`]}>{content}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SquareButton
