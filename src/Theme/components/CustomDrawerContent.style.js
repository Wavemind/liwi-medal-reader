import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Colors } = props

  return StyleSheet.create({
    closeWrapper: {
      ...Layout.flex,
      ...Layout.alignItemsEnd,
      ...Gutters.smallVPadding,
    },
    separator: {
      height: 1,
      backgroundColor: Colors.lightGrey,
    },
    wrapper: {
      ...Layout.fill,
      borderColor: Colors.grey,
      borderRightWidth: 1,
    },
  })
}
