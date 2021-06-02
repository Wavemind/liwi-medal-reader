import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors } = props

  return StyleSheet.create({
    pickerContainer: disabled => ({
      backgroundColor: Colors.secondary,
      height: hp(4.4),
      borderRadius: 20,
      opacity: disabled ? 0.5 : 1,
      justifyContent: 'center',
    }),
    picker: {
      width: wp(33.3),
      color: Colors.primary,
    },
  })
}
