import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Gutters.regularVPadding,
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
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Gutters.tinyBPadding,
    },
    dateWrapper: {
      flex: 0.6,
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
