import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Colors } = props

  return StyleSheet.create({
    animation: fadeAnim => ({
      ...Layout.fill,
      ...Layout.center,
      backgroundColor: Colors.red,
      opacity: fadeAnim,
    }),
  })
}
