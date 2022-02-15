import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Layout, Fonts, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.center,
      height: hp(50),
      ...Gutters.hugeBMargin,
    },
    messageWrapper: {
      ...Layout.center,
      height: hp(20),
    },
    title: {
      ...Fonts.textColorText,
      ...Fonts.textSmall,
    },
    delete: {
      ...Fonts.textSmall,
    },
    codeButtons: {
      ...Layout.center,
      height: hp(8.8),
    },
    secondTitle: {
      ...Fonts.textSmall,
      fontFamily: 'ZeitungPro',
    },
  })
}
