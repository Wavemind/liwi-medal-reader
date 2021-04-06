import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors } = props

  return StyleSheet.create({
    checkboxContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: disabled => ({
      margin: 8,
      color: disabled ? Colors.black : Colors.primary,
      opacity: disabled ? 0.3 : 1,
    }),
    tintColors: disabled => ({
      true: Colors.primary,
      false: disabled ? Colors.grey : Colors.primary,
    }),
  })
}
