import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Gutters, Fonts } = props

  return StyleSheet.create({
    input: {
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      ...Fonts.textSmall,
      width: wp(33.3),
      borderRadius: 20,
      backgroundColor: Colors.secondary,
    },
  })
}
