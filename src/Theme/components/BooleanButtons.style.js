import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    outerWrapper: {
      ...Layout.row,
      width: wp(33.3),
    },
    buttonWrapper: (
      side,
      active,
      disabled = false,
      inactiveBgColor = Colors.whiteToSecondary,
    ) => ({
      ...Layout.fill,
      ...Gutters.tinyVPadding,
      backgroundColor: active ? Colors.primary : inactiveBgColor,
      opacity: disabled ? 0.5 : 1,
      borderBottomLeftRadius: side === 'left' ? 20 : 0,
      borderTopLeftRadius: side === 'left' ? 20 : 0,
      borderBottomRightRadius: side === 'right' ? 20 : 0,
      borderTopRightRadius: side === 'right' ? 20 : 0,
      borderColor: Colors.primary,
      borderLeftWidth: side === 'right' ? 0 : 0.5,
      borderRightWidth: 0.5,
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
    }),
    buttonText: active => ({
      ...Gutters.tinyVPadding,
      ...Fonts.textSmall,
      color: active ? Colors.secondary : Colors.primary,
    }),
  })
}
