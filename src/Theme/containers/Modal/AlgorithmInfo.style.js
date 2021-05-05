import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fullHeight,
    },
  })
}
