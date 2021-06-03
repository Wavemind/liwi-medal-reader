import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Fonts } = props

  return StyleSheet.create({
    rightText: {
      ...Fonts.textSmall,
      ...Fonts.textBold,
    },
    leftText: toggleValue => ({
      ...Fonts.textSmall,
      color: toggleValue ? Colors.secondary : Colors.primary,
      ...Fonts.textBold,
    }),
    trackBarStyle: {
      borderColor: Colors.grey,
    },
  })
}
