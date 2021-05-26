import { StyleSheet } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'

export default function (props) {
  const { Colors, FontSize, Gutters, Layout } = props

  return StyleSheet.create({
    container: {
      display: 'flex',
      borderTopWidth: 1,
      backgroundColor: Colors.secondary,
      borderTopColor: Colors.grey,
      ...Layout.row,
    },
    emergencyContainer: {
      flexBasis: 70,
      borderRightWidth: 1,
      borderRightColor: Colors.grey,
      ...Layout.center,
    },
    emergencyWrapper: {
      ...Gutters.tinyVMargin,
      ...Gutters.tinyVPadding,
      ...Gutters.tinyHPadding,
      display: 'flex',
      borderRadius: Math.round(heightPercentageToDP(5.5)),
      height: Math.round(heightPercentageToDP(5.5)),
      width: Math.round(heightPercentageToDP(5.5)),
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
