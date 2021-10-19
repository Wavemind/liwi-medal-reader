import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters } = props

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
  })
}
