import { StyleSheet } from 'react-native'

export default function (props) {
  const { Fonts } = props

  return StyleSheet.create({
    counter: {
      fontSize: 140,
    },
    not_synchronized: {
      ...Fonts.textRegular,
      ...Fonts.textUppercase,
    },
  })
}
