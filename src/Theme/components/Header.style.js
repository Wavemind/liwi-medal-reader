import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularVPadding,
      ...Gutters.smallHPadding,
      ...Layout.row,
      elevation: 5,
      backgroundColor: Colors.secondary,
    },
    menu: {
      height: 35,
      ...Layout.colCenter,
    },
    titleWrapper: {
      ...Layout.colCenter,
      ...Gutters.largeLMargin,
    },
    title: {
      ...Fonts.titleSmall,
      color: Colors.primary,
    },
    connectionStatusWrapper: {
      ...Layout.fill,
      ...Layout.colCenter,
      ...Layout.alignItemsEnd,
    },
  })
}
