import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.hugeTMargin,
      ...Gutters.largeBMargin,
      ...Layout.left,
    },
  })
}
