import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, FontSize, Gutters, Layout } = props

  return StyleSheet.create({
    container: {
      display: 'flex',
      backgroundColor: Colors.secondary,
      ...Layout.row,
    },
    emergencyContainer: {
      flexBasis: 70,
      ...Layout.center,
    },
    emergencyWrapper: {
      ...Gutters.tinyVMargin,
      ...Gutters.tinyVPadding,
      ...Gutters.tinyHPadding,
      display: 'flex',
      borderRadius: hp(4.8),
      height: hp(4.8),
      width: hp(4.8),
      backgroundColor: Colors.red,
      ...Layout.row,
    },
    emergency: {
      fontSize: FontSize.large,
      color: Colors.secondary,
      ...Layout.selfCenter,
    },
    actions: {
      ...Layout.fill,
      ...Gutters.regularHPadding,
      ...Gutters.smallVPadding,
      ...Layout.rowCenter,
    },
    actionButton: {
      ...Layout.fill,
      ...Gutters.smallHMargin,
    },
  })
}
