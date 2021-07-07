import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Gutters, Fonts } = props

  return StyleSheet.create({
    input: editable => ({
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      ...Fonts.textSmall,
      width: wp(33.3),
      borderRadius: 20,
      borderColor: Colors.primary,
      borderWidth: 0.5,
      backgroundColor: editable ? Colors.secondary : Colors.disabled,
      color: editable ? Colors.primary : Colors.black,
    }),
  })
}
