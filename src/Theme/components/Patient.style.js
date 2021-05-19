import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Gutters.smallTPadding,
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
      ...Fonts.textBold,
      ...Fonts.textMedium,
      ...Gutters.tinyBPadding,
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
      color: active && Colors.secondary,
      padding: 5,
    }),
    picker: {
      width: 200,
      color: Colors.black,
    },
  })
}
