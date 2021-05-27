import { StyleSheet } from 'react-native'

export default function (props) {
  const { Fonts, Colors, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      borderRadius: 0,
      marginLeft: 0,
      marginRight: 0,
      ...Gutters.tinyVPadding,
    },
    textInactive: {
      ...Fonts.textColorText,
      ...Fonts.textUppercase,
    },
    textFocused: {
      color: Colors.secondary,
      ...Fonts.textUppercase,
      ...Fonts.textBold,
    },
  })
}
