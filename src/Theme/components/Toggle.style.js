import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.center,
    },
    iconStyle: {
      ...Layout.fill,
      ...Layout.rowCenter,
    },
    rightText: {
      ...Fonts.textSmall,
      ...Fonts.textBold,
      color: Colors.primary,
    },
    leftText: toggleValue => ({
      ...Fonts.textSmall,
      ...Fonts.textBold,
      color: toggleValue ? Colors.secondary : Colors.primary,
    }),
    trackBarStyle: {
      borderWidth: 1,
      borderColor: Colors.primary,
    },
  })
}
