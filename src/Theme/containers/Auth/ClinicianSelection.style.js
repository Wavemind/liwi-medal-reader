import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.hugeTMargin,
      ...Layout.fill,
      ...Layout.left,
    },
  })
}
