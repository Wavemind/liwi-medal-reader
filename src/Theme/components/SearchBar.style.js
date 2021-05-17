import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors, Layout } = props

  return StyleSheet.create({
    inputWrapper: {
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.grey,
      height: 70,
      borderRadius: 10,
      ...Gutters.smallVMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHMargin,
      ...Layout.row,
      ...Layout.fill,
      ...Gutters.regularLPadding,
    },
    inputTextWrapper: {
      ...Layout.colCenter,
      ...Gutters.regularLMargin,
    },
    inputText: { color: Colors.grey },
    filterButton: {
      ...Gutters.smallVMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      ...Gutters.regularRMargin,
      borderRadius: 10,
      backgroundColor: Colors.primary,
    },
  })
}
