import { StyleSheet } from 'react-native'

export default function (props) {
  return StyleSheet.create({
    camera: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: '#000',
    },
    buttonWrapper: {
      height: 75,
      flexDirection: 'row',
      bottom: 15,
      position: 'absolute',
      alignSelf: 'center',
    },
    loader: { width: 200 },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: { color: 'white', fontSize: 75, opacity: 0.7 },
  })
}
