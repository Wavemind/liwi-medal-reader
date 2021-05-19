/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const SquareButton = props => {
  // Props deconstruction
  const { label, filled, disabled, onPress, icon } = props

  // Theme and style elements deconstruction
  const {
    Components: { squareButton },
    Colors,
    Gutters,
    FontSize,
  } = useTheme()

  // Constants definition
  const type = filled ? 'filled' : 'outlined'

  return (
    <View style={squareButton.wrapper}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={squareButton[type](disabled)}
        disabled={disabled}
      >
        <View style={squareButton.textWrapper}>
          {icon && (
            <Icon
              name={icon}
              color={filled ? Colors.secondary : Colors.primary}
              size={FontSize.huge}
              style={{ ...Gutters.regularRMargin }}
            />
          )}
          <Text style={squareButton[`${type}Text`]}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SquareButton
