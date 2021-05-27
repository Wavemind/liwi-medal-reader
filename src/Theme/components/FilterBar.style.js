import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Layout, Fonts, Colors } = props

  return StyleSheet.create({
    container: {
      ...Layout.row,
      ...Gutters.regularVPadding,
      ...Gutters.regularLMargin,
    },
    clearFiltersButton: {
      ...Gutters.regularRPadding,
      ...Layout.row,
    },
    clearFiltersButtonWrapper: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.tinyVPadding,
    },
    clearFiltersButtonText: {
      ...Fonts.textTiny,
      ...Fonts.textCenter,
      color: Colors.red,
    },
  })
}
