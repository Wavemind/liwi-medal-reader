import { StyleSheet } from 'react-native'

export default function (props) {
  const { FontSize, Colors } = props

  return StyleSheet.create({
    wrapper: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
    },
    medicalCaseWrapper: { flex: 1, display: 'flex' },
    title: {
      height: 40,
      backgroundColor: Colors.black,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 20,
    },
    titleText: {
      color: '#fff',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: FontSize.regular,
    },
    tabBar: { width: 340 },
  })
}
