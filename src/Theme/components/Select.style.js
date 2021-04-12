import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.largeVMargin,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
    },
    label: {
      ...Fonts.textRegular,
      color: Colors.text,
    },
    pickerContainer: {
      height: 40,
      width: 200,
    },
    pickerDropDown: {
      backgroundColor: Colors.white,
    },
    pickerItem: {
      ...Layout.justifyContentStart,
    },
    pickerWrapperStyle: {
      backgroundColor: Colors.white,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
  })
}
