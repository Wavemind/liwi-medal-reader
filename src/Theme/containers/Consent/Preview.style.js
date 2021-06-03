import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters } = props

  return StyleSheet.create({
    content: {
      backgroundColor: Colors.primary,
      margin: 0,
      padding: 0,
      ...Layout.fill,
    },
    documentImage: {
      flex: 1,
      width: wp(98),
      height: hp(50),
      resizeMode: 'contain',
    },
    buttonsWrapper: {
      flexBasis: hp(10),
      backgroundColor: Colors.secondary,
      ...Layout.row,
    },
    button: {
      ...Layout.fill,
      ...Gutters.regularHMargin,
      ...Gutters.smallVMargin,
    },
  })
}
