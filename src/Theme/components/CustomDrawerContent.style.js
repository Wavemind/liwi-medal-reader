import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout } = props

  return StyleSheet.create({
    closeWrapper: {
      ...Layout.flex,
      ...Layout.alignItemsEnd,
    },
    separator: {
      height: 1,
      backgroundColor: '#CBCDD1',
    },
  })
}
