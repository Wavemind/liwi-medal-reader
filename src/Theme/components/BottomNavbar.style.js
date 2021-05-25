import { StyleSheet } from 'react-native'

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
      padding: 5,
      display: 'flex',
      borderRadius: 50,
      height: 50,
      width: 50,
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
