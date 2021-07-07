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
    medicalCaseWrapper: {
      flex: 1,
      display: 'flex',
    },
    titleWrapper: {
      height: hp(6),
      elevation: 5,
      backgroundColor: Colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...Fonts.textSmall,
      ...Gutters.regularLPadding,
    },
    title: {
      color: Colors.secondary,
      ...Fonts.textUppercase,
      ...Fonts.textRegular,
      ...Fonts.textBold,
    },
    tabBar: { width: wp(56.6) },
  })
}
