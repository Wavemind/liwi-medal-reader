import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    inputWrapper: resultsOpen => ({
      ...Gutters.smallVPadding,
      ...Layout.row,
      ...Layout.fill,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderBottomWidth: resultsOpen ? 0 : 1,
      borderColor: Colors.grey,
      borderRadius: 20,
      borderBottomLeftRadius: resultsOpen ? 0 : 20,
      borderBottomRightRadius: resultsOpen ? 0 : 20,
    }),
    inputTextWrapper: {
      ...Gutters.regularHMargin,
      ...Layout.grow,
    },
    inputText: {
      ...Fonts.textSmall,
      ...Layout.grow,
      color: Colors.black,
      padding: 0,
    },
    textArea: {
      ...Fonts.textSmall,
      ...Layout.grow,
      ...Gutters.smallVPadding,
      ...Gutters.smallHPadding,
      color: Colors.text,
      textAlignVertical: 'top',
    },
    searchIcon: {
      ...Layout.colHCenter,
      ...Gutters.smallRMargin,
    },
    resultsDropdown: {
      backgroundColor: Colors.secondary,
      position: 'relative',
      top: -1,
      borderColor: Colors.grey,
      borderWidth: 1,
      borderTopWidth: 1,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    dropdownItemWrapper: isLastResult => ({
      borderBottomWidth: isLastResult ? 0 : 1,
      borderBottomColor: Colors.grey,
    }),
    dropdownItemText: {
      ...Fonts.textSmall,
      color: Colors.text,
    },
  })
}
