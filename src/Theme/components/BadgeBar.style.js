import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Layout } = props

  return StyleSheet.create({
    container: {
      ...Layout.row,
      ...Gutters.regularTPadding,
    },
  })
}
