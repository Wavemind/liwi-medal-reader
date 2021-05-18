import { StyleSheet } from 'react-native'

export default function (props) {
  const { Fonts } = props

  return StyleSheet.create({
    textInactive: {
      ...Fonts.textUppercase,
    },
    textFocused: {
      ...Fonts.textUppercase,
      ...Fonts.textBold,
    },
  })
}
