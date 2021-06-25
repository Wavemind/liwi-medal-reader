import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts, Colors } = props

  return StyleSheet.create({
    headerTable: {
      backgroundColor: Colors.primary,
      ...Gutters.regularHPadding,
      ...Gutters.smallVPadding,
      ...Gutters.regularVMargin,
      ...Layout.row,
    },
    headerName: {
      ...Layout.fill,
      ...Fonts.textUppercase,
      ...Fonts.textColorSecondary,
      ...Fonts.textBold,
    },
    headerLastVisit: {
      ...Layout.fill,
      ...Fonts.textUppercase,
      ...Fonts.textColorSecondary,
      ...Fonts.textBold,
      flex: 0.5,
    },
    headerStatus: {
      ...Layout.fill,
      ...Fonts.textUppercase,
      ...Fonts.textColorSecondary,
      ...Fonts.textBold,
    },
  })
}
