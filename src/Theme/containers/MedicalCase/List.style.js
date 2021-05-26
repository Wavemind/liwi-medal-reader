import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts, Colors } = props

  return StyleSheet.create({
    headerTable: {
      backgroundColor: Colors.primary,
      ...Gutters.regularHPadding,
      ...Gutters.smallVPadding,
      ...Layout.row,
    },
    headerText: {
      ...Layout.fill,
      ...Fonts.textBold,
      ...Fonts.textUppercase,
      ...Fonts.textColorSecondary,
    },
  })
}
