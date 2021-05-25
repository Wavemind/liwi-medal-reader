import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    wrapper: warning => ({
      ...Gutters.regularVPadding,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgrey',
      backgroundColor: warning ? '#FDE7E8' : 'transparent',
    }),
    label: warning => ({
      ...Fonts.textRegular,
      color: warning ? Colors.primary : Colors.text,
    }),
    buttonsWrapper: {
      ...Layout.justifyContentAround,
      ...Layout.row,
      width: 200,
    },
    buttonWrapper: (side, active, disabled) => ({
      ...Layout.fill,
      backgroundColor: active ? Colors.primary : Colors.secondary,
      opacity: disabled ? 0.5 : 1,
      borderBottomLeftRadius: side === 'left' ? 20 : 0,
      borderTopLeftRadius: side === 'left' ? 20 : 0,
      borderBottomRightRadius: side === 'right' ? 20 : 0,
      borderTopRightRadius: side === 'right' ? 20 : 0,
      borderRightWidth: side === 'left' ? 1 : 0,
      borderRightColor: side === 'left' ? 'lightgrey' : 'transparent',
    }),
    buttonText: active => ({
      ...Gutters.smallVPadding,
      color: active ? Colors.secondary : Colors.primary,
    }),
  })
}
