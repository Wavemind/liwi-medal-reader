import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, FontSize, Gutters, Layout } = props

  return StyleSheet.create({
    container: {
      display: 'flex',
      backgroundColor: Colors.secondary,
      borderColor: Colors.grey,
      borderTopWidth: 1,
      ...Layout.row,
    },
    emergencyContainer: {
      flexBasis: 70,
      ...Layout.center,
    },
    emergencyWrapper: {
      ...Gutters.tinyVMargin,
      display: 'flex',
      borderRadius: hp(5.5),
      height: hp(5.5),
      width: hp(5.5),
      backgroundColor: Colors.red,
      ...Layout.row,
      ...Layout.center,
    },
    emergency: {
      fontSize: FontSize.large,
      color: Colors.white,
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
