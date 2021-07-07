import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    checkboxContainer: {
      ...Layout.row,
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: disabled => ({
      ...Gutters.smallHMargin,
      ...Gutters.smallVMargin,
      ...Fonts.textSmall,
      color: disabled ? Colors.primary : Colors.primary,
      opacity: disabled ? 0.3 : 1,
    }),
    tintColors: disabled => ({
      true: Colors.primary,
      false: disabled ? Colors.grey : Colors.primary,
    }),
  })
}
