import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Fonts } = props

  const circleRadius = hp(1.7)

  return StyleSheet.create({
    outerCircle: {
      ...Layout.colCenter,
      borderColor: Colors.primary,
      borderWidth: 3,
      height: 2 * circleRadius,
      width: 2 * circleRadius,
      borderRadius: circleRadius,
    },
    innerText: {
      ...Fonts.textSmall,
      color: Colors.primary,
      ...Fonts.textBold,
    },
  })
}
