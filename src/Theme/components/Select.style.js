import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors } = props

  return StyleSheet.create({
    pickerContainer: disabled => ({
      backgroundColor: Colors.white,
      height: hp(4.4),
      opacity: disabled ? 0.5 : 1,
      justifyContent: 'center',
      borderRadius: 20,
      borderColor: Colors.primary,
      borderWidth: 0.5,
    }),
    picker: {
      width: wp(33.3),
      color: Colors.black,
    },
  })
}
