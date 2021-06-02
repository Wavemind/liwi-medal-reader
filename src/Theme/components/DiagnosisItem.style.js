import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.tinyVPadding,
      borderBottomColor: 'rgba(0,0,0,0.2)',
      borderBottomWidth: 1,
    },
  })
}
