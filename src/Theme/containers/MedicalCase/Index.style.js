import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
    },
    medicalCaseWrapper: { flex: 1, display: 'flex' },
    title: {
      height: hp(4.4),
      backgroundColor: Colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...Fonts.textSmall,
      ...Gutters.regularLPadding,
    },
    titleText: {
      color: Colors.secondary,
      ...Fonts.textUppercase,
      ...Fonts.textBold,
      ...Fonts.textRegular,
    },
    tabBar: { width: wp(56.6) },
  })
}
