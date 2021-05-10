import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Gutters.hugeTPadding,
      ...Gutters.largeHPadding,
    },
    animation: fadeAnim => ({
      ...Layout.fill,
      opacity: fadeAnim,
    }),
  })
}
