import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

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
      ...Fonts.textUppercase,
      ...Fonts.textColorSecondary,
      ...Fonts.textBold,
      width: wp(38),
    },
    headerLastVisit: {
      ...Fonts.textUppercase,
      ...Fonts.textColorSecondary,
      ...Fonts.textBold,
      width: wp(20),
    },
    headerStatus: {
      ...Fonts.textUppercase,
      ...Fonts.textColorSecondary,
      ...Fonts.textBold,
    },
  })
}
