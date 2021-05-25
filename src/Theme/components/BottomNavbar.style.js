import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, FontSize, Gutters, Layout } = props

  return StyleSheet.create({
    container: {
      display: 'flex',
      borderTopWidth: 1,
      borderTopColor: Colors.grey,
      flexDirection: 'row',
    },
    emergencyContainer: {
      padding: 10,
      borderRightWidth: 1,
      flexDirection: 'row',
      display: 'flex',
      borderRightColor: Colors.grey,
    },
    emergency: {
      fontSize: FontSize.large,
      alignSelf: 'center',
    },
    actions: {
      ...Layout.fill,
      ...Gutters.smallHPadding,
      ...Gutters.smallVPadding,
      ...Layout.rowCenter,
    },
    actionButton: {
      ...Layout.fill,
      ...Gutters.smallHMargin,
    },
  })
}
