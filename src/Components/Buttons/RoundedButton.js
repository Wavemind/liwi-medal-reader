/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { FontSize } from '@/Theme/Variables'

const RoundedButton = ({
  label = null,
  filled,
  disabled,
  onPress,
  icon,
  big = false,
  iconAfter = false,
  bgColor = null,
  color = null,
  iconSize = FontSize.huge,
  align = null,
  fullWidth = true,
}) => {
  // Theme and style elements deconstruction
  const {
    Components: { roundedButton },
    Colors,
    Layout,
  } = useTheme()

  // Constants definition
  const type = useMemo(() => (filled ? 'filled' : 'outlined'), [filled])
  const iconColor = useMemo(() => {
    if (color === null) {
      if (filled) {
        return Colors.secondary
      }
      return Colors.primary
    }
    return color
  }, [color, filled])

  return (
    <View style={roundedButton.wrapper(fullWidth)}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={roundedButton[type](disabled, bgColor, align, big)}
        disabled={disabled}
      >
        <View style={Layout.rowCenter}>
          {!iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              style={roundedButton.iconLeft(big)}
              size={iconSize}
            />
          )}
          {label !== null && (
            <View style={roundedButton.textWrapper}>
              <Text style={roundedButton[`${type}Text`](color)}>{label}</Text>
            </View>
          )}
          {iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              style={roundedButton.iconRight(big)}
              size={iconSize}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default RoundedButton
