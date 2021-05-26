import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters } = props

  return StyleSheet.create({
    checkboxContainer: {
      ...Layout.row,
      ...Gutters.regularBMargin,
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: disabled => ({
      ...Gutters.smallHMargin,
      ...Gutters.smallVMargin,
      color: disabled ? Colors.text : Colors.primary,
      opacity: disabled ? 0.3 : 1,
    }),
    tintColors: disabled => ({
      true: Colors.primary,
      false: disabled ? Colors.grey : Colors.primary,
    }),
  })
}
