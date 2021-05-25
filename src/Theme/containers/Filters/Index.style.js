import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Gutters } = props

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
      color: 'grey',
    },
    button: {
      backgroundColor: 'red',
      borderRadius: 10,
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
    },
  })
}
