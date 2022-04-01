import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Gutters, Layout } = props

  return StyleSheet.create({
    pickerWrapper: {
      ...Layout.justifyContentCenter,
      ...Gutters.smallTMargin,
      backgroundColor: Colors.secondary,
      height: hp(4.4),
      borderRadius: 20,
      borderColor: Colors.grey,
      borderWidth: 1,
    },
    picker: {
      color: Colors.primary,
    },
  })
}
