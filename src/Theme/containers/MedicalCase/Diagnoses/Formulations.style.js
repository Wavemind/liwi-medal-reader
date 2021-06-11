import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  return StyleSheet.create({
    booleanButtonWrapper: {
      ...Layout.row,
      width: wp(33.3),
    },
    wrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularVMargin,
      backgroundColor: Colors.secondary,
    },
    formulationsHeaderWrapper: {
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      backgroundColor: Colors.primary,
    },
    formulationsHeader: {
      ...Fonts.textSmall,
      ...Fonts.textUppercase,
      color: Colors.secondary,
    },
  })
}
