import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout } = props

  return StyleSheet.create({
    animation: fadeAnim => ({
      ...Layout.fill,
      ...Layout.center,
      backgroundColor: '#d20730',
      opacity: fadeAnim,
    }),
  })
}
