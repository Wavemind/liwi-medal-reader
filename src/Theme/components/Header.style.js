import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.smallVPadding,
      ...Gutters.smallHPadding,
      ...Layout.row,
      elevation: 5,
      backgroundColor: Colors.secondary,
    },
    menu: {
      ...Layout.colCenter,
    },
    titleWrapper: {
      ...Layout.colCenter,
      ...Gutters.largeLMargin,
    },
    title: {
      ...Fonts.titleSmall,
    },
    connectionStatusWrapper: {
      ...Layout.fill,
      ...Layout.alignItemsEnd,
    },
  })
}
