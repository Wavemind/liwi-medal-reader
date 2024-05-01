import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    inputWrapper: resultsOpen => ({
      ...Gutters.smallVPadding,
      ...Layout.row,
      ...Layout.fill,
      backgroundColor: Colors.whiteToSecondary,
      borderWidth: 1,
      borderTopWidth: resultsOpen ? 0 : 1,
      borderColor: Colors.grey,
      borderRadius: 20,
      borderTopLeftRadius: resultsOpen ? 0 : 20,
      borderTopRightRadius: resultsOpen ? 0 : 20,
    }),
    inputTextWrapper: {
      ...Gutters.regularHMargin,
      ...Layout.grow,
    },
    inputText: {
      ...Fonts.textSmall,
      ...Layout.grow,
      color: Colors.primary,
      padding: 0,
    },
    textArea: {
      ...Fonts.textSmall,
      ...Layout.grow,
      ...Gutters.smallVPadding,
      ...Gutters.smallHPadding,
      color: Colors.primary,
      textAlignVertical: 'top',
    },
    searchIcon: {
      ...Layout.colHCenter,
      ...Gutters.smallRMargin,
    },
    resultsDropdown: {
      backgroundColor: Colors.whiteToSecondary,
      position: 'absolute',
      bottom: '100%',
      right: 0,
      left: 0,
      borderColor: Colors.grey,
      borderWidth: 1,
      borderBottomWidth: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    dropdownItemWrapper: isLastResult => ({
      borderBottomWidth: isLastResult ? 0 : 1,
      borderBottomColor: Colors.grey,
    }),
    dropdownItemText: {
      ...Fonts.textSmall,
      color: Colors.primary,
    },
  })
}
