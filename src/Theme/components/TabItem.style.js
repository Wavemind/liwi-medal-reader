import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, FontSize } = props

  return StyleSheet.create({
    focused: {
      borderBottomColor: Colors.black,
      borderBottomWidth: 5,
      marginRight: 10,
      marginLeft: 10,
    },
    text: {
      color: Colors.black,
      marginRight: 10,
      marginLeft: 10,
      fontSize: FontSize.small,
    },
    textFocused: { fontWeight: 'bold' },
    textToDo: { color: Colors.grey },
    tab: {
      padding: 7,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 10,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
  })
}
