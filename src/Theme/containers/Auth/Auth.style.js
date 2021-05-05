import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Colors, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.colCenter,
      ...Gutters.hugeVMargin,
    },
    animation: fadeAnim => ({
      ...Layout.fill,
      width: 400,
      opacity: fadeAnim,
    }),
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
      bottom: 0,
    },
  })
}
