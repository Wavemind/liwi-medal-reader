import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, FontSize, Layout, Fonts, Gutters } = props

  return StyleSheet.create({
    focused: {
      borderBottomColor: Colors.black,
      borderBottomWidth: 5,
      marginHorizontal: 10,
    },
    text: status => ({
      color: status === 'toDo' ? Colors.grey : Colors.black,
      marginHorizontal: 10,
      ...Gutters.smallVPadding,
      fontSize: FontSize.tiny,
      fontWeight: status === 'current' ? 'bold' : 'normal',
      borderBottomColor: status === 'current' ? Colors.black : Colors.white,
      borderBottomWidth: 5,
      flex: 1,
      ...Layout.fill,
      ...Fonts.textCenter,
    }),
    tab: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
