import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Gutters, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.regularTMargin,
    },
    title: {
      ...Layout.fill,
      ...Fonts.textUppercase,
      ...Fonts.textRegular,
      ...Fonts.textBold,
      color: Colors.grey,
    },
    button: {
      backgroundColor: Colors.red,
      borderRadius: 10,
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
    },
  })
}
