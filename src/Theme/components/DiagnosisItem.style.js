import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.tinyVPadding,
      borderBottomColor: Colors.grey,
      borderBottomWidth: 1,
    },
  })
}
