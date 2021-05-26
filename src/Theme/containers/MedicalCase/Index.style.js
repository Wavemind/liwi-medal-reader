import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen'

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
      height: Math.round(heightPercentageToDP(4.4)),
      backgroundColor: Colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...Gutters.regularLPadding,
    },
    titleText: {
      color: Colors.secondary,
      ...Fonts.textUppercase,
      ...Fonts.textBold,
      ...Fonts.textRegular,
    },
    tabBar: { width: Math.round(widthPercentageToDP(56.6)) },
  })
}
