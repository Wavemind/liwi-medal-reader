import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    inputWrapper: {
      ...Gutters.smallTMargin,
      ...Gutters.smallVPadding,
      ...Layout.row,
      ...Layout.fill,
      ...Gutters.regularLPadding,
      backgroundColor: Colors.secondary,
      borderWidth: 1,
      borderColor: Colors.grey,
      height: hp(6),
      borderRadius: 10,
    },
    inputTextWrapper: {
      ...Gutters.regularHMargin,
      ...Layout.grow,
    },
    inputText: {
      ...Fonts.textSmall,
      ...Layout.grow,
      color: Colors.grey,
      padding: 0,
    },
    clearButton: {
      ...Layout.colHCenter,
      ...Gutters.smallRMargin,
    },
  })
}
