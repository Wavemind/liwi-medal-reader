import { StyleSheet } from 'react-native'

export default function (props) {
  const { Fonts, Colors, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      borderRadius: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      ...Gutters.tinyVPadding,
    },
    textInactive: {
      ...Fonts.textColorText,
      ...Fonts.textDrawer,
      ...Fonts.textUppercase,
    },
    textFocused: {
      color: Colors.secondary,
      ...Fonts.textDrawer,
      ...Fonts.textUppercase,
      ...Fonts.textBold,
    },
  })
}
