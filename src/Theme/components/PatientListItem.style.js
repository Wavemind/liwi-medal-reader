import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

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
      ...Layout.center,
      ...Layout.row,
    },
    titleWrapper: {
      ...Layout.fill,
      ...Layout.colum,
    },
    title: {
      ...Fonts.textMedium,
      ...Fonts.textBold,
      ...Gutters.tinyBPadding,
    },
    dateWrapper: {
      flex: 0.5,
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
