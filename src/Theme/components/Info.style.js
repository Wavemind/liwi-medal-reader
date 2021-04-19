import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Fonts } = props

  const circleRadius = 16

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
      fontWeight: 'bold',
    },
  })
}
