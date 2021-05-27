import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Colors } = props

  return StyleSheet.create({
    closeWrapper: {
      ...Layout.flex,
      ...Layout.alignItemsEnd,
    },
    separator: {
      height: 1,
      backgroundColor: Colors.lightGrey,
    },
    wrapper: {
      ...Layout.fill,
      borderColor: Colors.primary,
      borderRightWidth: 1,
    },
  })
}
