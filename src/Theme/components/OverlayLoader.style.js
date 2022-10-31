import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Colors } = props

  return StyleSheet.create({
    container: {
      ...Layout.center,
      ...Layout.fullSize,
      position: 'absolute',
      backgroundColor: Colors.black,
      opacity: 0.8,
      zIndex: 999999,
    },
  })
}
