import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors } = props

  return StyleSheet.create({
    content: {
      backgroundColor: Colors.primary,
      margin: 0,
      padding: 0,
    },
    documentImage: {
      flex: 1,
      width: wp(98),
      height: hp(50),
      resizeMode: 'contain',
    },
  })
}
