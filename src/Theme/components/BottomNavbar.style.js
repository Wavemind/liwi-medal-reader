import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, FontSize, Gutters, Layout } = props

  return StyleSheet.create({
    container: {
      display: 'flex',
      borderTopWidth: 1,
      backgroundColor: 'white',
      borderTopColor: Colors.grey,
      flexDirection: 'row',
    },
    emergencyContainer: {
      flexBasis: 70,
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: Colors.grey,
    },
    emergencyWrapper: {
      ...Gutters.tinyVMargin,
      padding: 5,
      flexDirection: 'row',
      display: 'flex',
      borderRadius: 50,
      height: 50,
      width: 50,
      backgroundColor: Colors.red,
    },
    emergency: {
      fontSize: FontSize.large,
      alignSelf: 'center',
      color: Colors.white,
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
