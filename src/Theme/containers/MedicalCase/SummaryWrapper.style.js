import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    patientValues: {
      ...Layout.row,
      ...Gutters.smallHMargin,
      ...Gutters.smallVMargin,
    },
    leftColumn: {
      ...Layout.fill,
      ...Layout.column,
      ...Gutters.tinyRMargin,
    },
    rightColumn: {
      ...Layout.fill,
      ...Layout.column,
      ...Gutters.tinyLMargin,
    },
    idContainer: {
      ...Gutters.smallHMargin,
      ...Gutters.smallVPadding,
      borderTopWidth: 1,
    },
    idDisplay: {
      ...Fonts.textTiny,
      ...Fonts.textItalic,
    },
  })
}
