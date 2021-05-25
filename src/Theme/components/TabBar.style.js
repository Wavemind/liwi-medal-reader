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
    text: status => ({
      color: status === 'toDo' ? Colors.grey : Colors.black,
      marginRight: 10,
      marginLeft: 10,
      padding: 7,
      fontSize: FontSize.small,
      fontWeight: status === 'current' ? 'bold' : 'normal',
      borderBottomColor: status === 'current' ? Colors.black : Colors.white,
      borderBottomWidth: 5,
    }),
    tab: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 10,
      flex: 1,
    },
    wrapper: {
      minWidth: '100%',
      alignContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
  })
}
