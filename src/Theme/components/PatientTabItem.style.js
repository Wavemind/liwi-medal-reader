import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    tab: active => ({
      ...Layout.fill,
      ...Layout.center,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      display: 'flex',
      backgroundColor: active ? Colors.primary : Colors.secondary,
    }),
    tabText: active => ({
      ...Fonts.textUppercase,
      ...Fonts.textBold,
      color: active ? Colors.secondary : Colors.primary,
    }),
  })
}
