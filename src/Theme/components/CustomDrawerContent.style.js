import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Colors, Fonts } = props

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
    logout: {
      ...Fonts.textColorText,
      ...Fonts.textUppercase,
      marginLeft: 0,
      marginRight: 0,
    },
  })
}
