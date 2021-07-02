import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    inputWrapper: {
      backgroundColor: Colors.secondary,
      borderWidth: 1,
      borderColor: Colors.primary,
      height: hp(6),
      borderRadius: 10,
      ...Gutters.smallVMargin,
      ...Gutters.smallVPadding,
      ...Layout.row,
      ...Layout.fill,
      ...Gutters.regularLPadding,
    },
    inputTextWrapper: {
      ...Layout.colCenter,
      ...Gutters.regularLMargin,
    },
    inputText: { ...Fonts.textSmall, color: Colors.grey },
    filterButton: {
      ...Layout.center,
      ...Gutters.smallTMargin,
      ...Gutters.regularHPadding,
      ...Gutters.regularRMargin,
      borderRadius: 10,
      backgroundColor: Colors.red,
    },
  })
}
