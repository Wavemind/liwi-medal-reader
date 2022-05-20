import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: disabled => ({
      ...Layout.fill,
      ...Gutters.smallTPadding,
      ...Gutters.regularHMargin,
      borderBottomWidth: 1,
      borderColor: Colors.grey,
      opacity: disabled ? 0.5 : 1,
    }),
    container: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
    },
    title: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Gutters.tinyRMargin,
      color: Colors.primary,
    },
    count: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Gutters.tinyRMargin,
      color: Colors.primary,
    },
    diagnosesWrapper: {
      ...Layout.column,
      width: wp(33),
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
