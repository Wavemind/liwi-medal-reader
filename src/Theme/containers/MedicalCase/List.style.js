import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    headerTable: {
      backgroundColor: 'black',
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
