import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Gutters.smallTPadding,
      ...Gutters.regularHMargin,
      borderBottomWidth: 1,
      borderColor: Colors.grey,
    },
    container: {
      ...Layout.alignItemsCenter,
      ...Layout.row,
    },
    titleWrapper: {
      ...Layout.column,
      width: wp(38),
    },
    title: {
      ...Fonts.textMedium,
      ...Fonts.textBold,
      ...Gutters.tinyBPadding,
    },
    dateWrapper: {
      ...Layout.grow,
      width: wp(20),
    },
    statusWrapper: {
      ...Layout.center,
      ...Layout.column,
    },
    statusTitle: {
      ...Fonts.textBold,
      ...Fonts.textUppercase,
      ...Gutters.tinyBPadding,
    },
    icon: active => ({
      backgroundColor: active && Colors.primary,
      color: active ? Colors.secondary : Colors.grey,
      ...Gutters.tinyVPadding,
      ...Gutters.tinyHPadding,
    }),
    picker: {
      width: hp(22),
      color: Colors.primary,
    },
  })
}
