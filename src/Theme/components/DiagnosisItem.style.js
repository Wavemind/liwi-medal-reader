import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors, Layout } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
      ...Gutters.tinyVPadding,
      borderBottomColor: Colors.grey,
      borderBottomWidth: 1,
    },
  })
}
