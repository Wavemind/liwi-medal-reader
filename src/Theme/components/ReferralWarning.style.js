/**
 * The external imports
 */
import { StyleSheet } from 'react-native'

/**
 * The internal imports
 */

export default function (props) {
  const { Colors, Gutters, Layout, Fonts, FontSize } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularVMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      ...Layout.row,
      ...Layout.center,
      backgroundColor: Colors.red,
    },
    textWarning: {
      ...Fonts.textColorText,
      color: Colors.white,
      fontSize: FontSize.regular,
      textTransform: 'uppercase',
      fontFamily: 'ZeitungPro-Bold',
    },
  })
}
