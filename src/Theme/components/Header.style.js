import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularVPadding,
      ...Gutters.smallHPadding,
      ...Layout.row,
      backgroundColor: '#FFF',
    },
    menu: {
      ...Layout.colCenter,
    },
    titleWrapper: {
      ...Layout.colCenter,
      ...Gutters.largeLMargin,
    },
    title: {
      ...Fonts.textColorText,
      ...Fonts.textSmall,
    },
    connectionStatusWrapper: {
      ...Layout.fill,
      ...Layout.alignItemsEnd,
    },
  })
}
