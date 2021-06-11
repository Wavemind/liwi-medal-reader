import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    buttonWrapper: (
      side,
      active,
      disabled = false,
      outlined = false,
      inactiveBgColor = Colors.secondary,
    ) => ({
      ...Layout.fill,
      ...Gutters.tinyVPadding,
      backgroundColor: active ? Colors.primary : inactiveBgColor,
      opacity: disabled ? 0.5 : 1,
      borderBottomLeftRadius: side === 'left' ? 20 : 0,
      borderTopLeftRadius: side === 'left' ? 20 : 0,
      borderBottomRightRadius: side === 'right' ? 20 : 0,
      borderTopRightRadius: side === 'right' ? 20 : 0,
      borderRightWidth: side === 'left' || outlined ? 0.5 : 0,
      borderRightColor:
        side === 'left' || outlined ? Colors.primary : Colors.transparent,
      borderLeftWidth: side === 'left' && outlined ? 0.5 : 0,
      borderTopWidth: outlined ? 0.5 : 0,
      borderBottomWidth: outlined ? 0.5 : 0,
    }),
    buttonText: active => ({
      ...Gutters.tinyVPadding,
      ...Fonts.textSmall,
      color: active ? Colors.secondary : Colors.primary,
    }),
  })
}
