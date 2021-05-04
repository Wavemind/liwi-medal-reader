import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Fonts } = props

  return StyleSheet.create({
    formWrapper: {
      ...Layout.colVCenter,
      width: '100%',
    },
    input: {
      backgroundColor: Colors.white,
      height: 40,
      marginTop: 12,
      width: '100%',
      borderWidth: 1,
      color: Colors.black,
      paddingHorizontal: 10,
    },
    buttonWrapper: {
      marginTop: 30,
    },
  })
}
