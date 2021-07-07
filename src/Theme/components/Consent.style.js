import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    question: {
      ...Layout.fill,
      ...Fonts.textMedium,
      color: Colors.primary,
    },
    buttonsWrapper: {
      ...Layout.row,
      ...Gutters.regularTMargin,
    },
    showConsentButton: {
      ...Layout.fill,
      ...Layout.column,
    },
    scanConsentButton: {
      ...Layout.fill,
      ...Layout.column,
      ...Gutters.regularLMargin,
    },
  })
}
