import { StyleSheet } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'

export default function (props) {
  const { Layout, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.center,
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
      height: Math.round(heightPercentageToDP(8.8)),
    },
    secondTitle: {
      ...Fonts.textSmall,
      fontFamily: 'ZeitungPro',
    },
  })
}
