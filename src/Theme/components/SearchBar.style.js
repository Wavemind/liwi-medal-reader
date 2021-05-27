import { StyleSheet } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    inputWrapper: {
      backgroundColor: Colors.secondary,
      borderWidth: 1,
      borderColor: Colors.grey,
      height: Math.round(heightPercentageToDP(6)),
      borderRadius: 10,
      ...Gutters.smallVMargin,
      ...Gutters.smallVPadding,
      ...Gutters.regularHMargin,
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
      ...Gutters.smallVMargin,
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      ...Gutters.regularRMargin,
      borderRadius: 10,
      backgroundColor: Colors.primary,
    },
  })
}
