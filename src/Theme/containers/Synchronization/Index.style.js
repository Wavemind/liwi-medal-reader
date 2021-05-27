import { StyleSheet } from 'react-native'

export default function (props) {
  const { Fonts } = props

  return StyleSheet.create({
    counter: {
      fontSize: 140,
    },
    notSynchronized: {
      ...Fonts.textRegular,
      ...Fonts.textUppercase,
    },
  })
}
