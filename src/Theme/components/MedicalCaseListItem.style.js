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
      width: wp(30),
      ...Layout.colum,
    },
    title: {
      ...Fonts.textMedium,
      ...Fonts.textBold,
      ...Gutters.tinyBPadding,
      color: Colors.primary,
    },
    birthDate: {
      ...Fonts.textTiny,
      ...Gutters.tinyBPadding,
      color: Colors.primary,
    },
    date: {
      ...Fonts.textSemiBold,
      color: Colors.primary,
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
      color: Colors.primary,
    },
    icon: active => ({
      backgroundColor: active ? Colors.primary : Colors.transparent,
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
