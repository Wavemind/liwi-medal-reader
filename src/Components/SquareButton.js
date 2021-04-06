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

  const { Common } = useTheme()

  const handlePress = () => {
    console.log('button pressed')
  }

  return (
    <View style={Common.squareButton.wrapper}>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={Common.squareButton[type](disabled)}
        disabled={disabled}
      >
        <Text style={Common.squareButton[`${type}Text`]}>{content}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SquareButton
