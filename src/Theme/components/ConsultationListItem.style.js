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
      color: Colors.primary,
    },
    count: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Gutters.largeRMargin,
      color: Colors.primary,
    },
    diagnosesWrapper: {
      ...Layout.grow,
      ...Layout.column,
    },
    diagnosis: {
      ...Fonts.textTiny,
      color: Colors.primary,
    },
    date: {
      ...Fonts.textTiny,
      ...Gutters.regularRMargin,
      color: Colors.primary
    },
  })
}
