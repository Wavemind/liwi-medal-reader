import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Colors, Gutters } = props

  return StyleSheet.create({
    header: {
      ...Fonts.textColorText,
      ...Fonts.titleSmall,
      ...Fonts.textCenter,
      ...Gutters.largeBMargin,
    },
    errorMessage: {
      ...Fonts.textRegular,
      color: Colors.primary,
    },
    switchOuterWrapper: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentCenter,
    },
    switchInnerWrapper: {
      ...Layout.alignItemsCenter,
    },
    switchLabel: {
      ...Fonts.textSmall,
      ...Gutters.regularLMargin,
      color: Colors.text,
    },
    themeToggleWrapper: {
      position: 'absolute',
      ...Layout.alignItemsCenter,
      ...Layout.justifyContentCenter,
      bottom: 0,
      left: 0,
      right: 0,
    },
  })
}
