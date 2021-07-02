import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Gutters.regularVPadding,
      ...Gutters.regularHMargin,
      borderBottomWidth: 1,
      borderColor: Colors.grey,
    },
    container: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
    },
    title: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Gutters.regularRMargin,
    },
    count: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Gutters.largeRMargin,
    },
    diagnosesWrapper: {
      ...Layout.grow,
      ...Layout.column,
    },
    date: {
      ...Fonts.textTiny,
      ...Gutters.regularRMargin,
    },
  })
}
