import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  return StyleSheet.create({
    wrapper: {
      height: hp(40),
    },
    image: {
      height: hp(100),
      width: wp(100),
    },
    modal: {
      margin: 0,
    },
  })
}
