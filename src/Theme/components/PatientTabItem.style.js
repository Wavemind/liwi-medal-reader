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
      borderBottomWidth: 2,
      borderColor: Colors.primary,
    }),
    tabText: active => ({
      ...Fonts.textSmall,
      ...Fonts.textUppercase,
      ...(active ? Fonts.textBold : null),
      color: active ? Colors.secondary : Colors.primary,
    }),
  })
}
