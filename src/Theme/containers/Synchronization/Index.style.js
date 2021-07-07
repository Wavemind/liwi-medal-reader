import { StyleSheet } from 'react-native'

export default function (props) {
  const { Fonts, Colors } = props

  return StyleSheet.create({
    counter: {
      fontSize: 140,
      color: Colors.primary,
    },
    notSynchronized: {
      ...Fonts.textRegular,
      ...Fonts.textUppercase,
      color: Colors.primary,
    },
  })
}
