import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHMargin,
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      borderBottomWidth: 1,
      borderColor: Colors.grey,
    },
    titleWrapper: {
      ...Layout.column,
      ...Gutters.smallVMargin,
    },
    title: {
      ...Fonts.textSmall,
      ...Fonts.textBold,
      ...Fonts.textUppercase,
      ...Gutters.tinyBPadding,
      color: Colors.primary,
    },
    subtitle: {
      ...Fonts.textTiny,
      color: Colors.primary,
    },
    statusWrapper: {
      ...Layout.rowHCenter,
      ...Layout.fullHeight,
    },
    iconWrapper: active => ({
      ...Layout.fullHeight,
      ...Layout.rowHCenter,
      backgroundColor: active && Colors.primary,
    }),
    icon: active => ({
      ...Gutters.regularVPadding,
      ...Gutters.tinyHPadding,
      color: active ? Colors.secondary : Colors.grey,
    }),
    date: {
      ...Fonts.textTiny,
      color: Colors.primary,
    },
  })
}
