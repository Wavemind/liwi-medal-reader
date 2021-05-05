import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Colors, Gutters } = props

  const buttonDimensions = 50

  return StyleSheet.create({
    wrapper: {
      ...Layout.fullHeight,
    },
  })
}
