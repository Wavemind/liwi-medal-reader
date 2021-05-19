import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    focused: {
      borderBottomColor: Colors.black,
      borderBottomWidth: 5,
    },
    text: { color: Colors.black },
    textFocused: { fontWeight: 'bold' },
    textToDo: { color: Colors.grey },
    tab: {
      flex: 1,
      padding: 7,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
  })
}
