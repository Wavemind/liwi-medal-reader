import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors } = props

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
    emergencyContainertwo: {
      padding: 10,
      flex: 7,
      width: 80,
      borderRightWidth: 1,
      borderRightColor: Colors.grey,
    },
  })
}
