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
  const { content, filled, disabled, handlePress } = props

  // Theme and style elements deconstruction
  const {
    Components: { squareButton },
  } = useTheme()

  // Constants definition
  const type = filled ? 'filled' : 'outlined'

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
