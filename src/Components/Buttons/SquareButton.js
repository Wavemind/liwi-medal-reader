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
  const {
    label,
    filled,
    disabled,
    onPress,
    icon,
    iconAfter = false,
    bgColor = null,
    color = null,
    iconSize = null,
    align = null,
  } = props

  // Theme and style elements deconstruction
  const {
    Components: { squareButton },
    Colors,
    FontSize,
    Layout,
  } = useTheme()

  // Constants definition
  const type = filled ? 'filled' : 'outlined'
  const iconColor =
    color !== null ? color : filled ? Colors.secondary : Colors.primary

  return (
    <View style={squareButton.wrapper}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[squareButton[type](disabled, bgColor, align)]}
        disabled={disabled}
      >
        <View style={[Layout.rowCenter]}>
          {!iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              size={iconSize !== null ? iconSize : FontSize.regular}
            />
          )}
          <View style={squareButton.textWrapper}>
            <Text style={squareButton[`${type}Text`](color)}>{label}</Text>
          </View>
          {iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              size={iconSize !== null ? iconSize : FontSize.regular}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SquareButton
