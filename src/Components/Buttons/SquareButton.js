/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { Text, View, Pressable } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { FontSize } from '@/Theme/Variables'

const SquareButton = ({
  label = null,
  filled,
  disabled,
  onPress,
  icon,
  big,
  iconAfter = false,
  bgColor = null,
  color = null,
  iconSize = FontSize.huge,
  align = null,
  fullWidth = true,
  ...rest
}) => {
  // Theme and style elements deconstruction
  const {
    Components: { squareButton },
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

  // onLongPress doesn't work with chrome debugger open https://github.com/facebook/react-native/issues/4944
  return (
    <View style={squareButton.wrapper(fullWidth)}>
      <Pressable
        onPress={() => onPress()}
        style={({ pressed }) => [
          squareButton[type](disabled, bgColor, align, big),
          pressed ? { opacity: 0.9 } : {},
        ]}
        disabled={disabled}
        {...rest}
      >
        <View style={Layout.rowCenter}>
          {!iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              style={squareButton.iconLeft(big)}
              size={iconSize}
            />
          )}
          {label !== null && (
            <View style={squareButton.textWrapper}>
              <Text style={squareButton[`${type}Text`](color)}>{label}</Text>
            </View>
          )}
          {iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              style={squareButton.iconRight(big)}
              size={iconSize}
            />
          )}
        </View>
      </Pressable>
    </View>
  )
}

export default SquareButton
