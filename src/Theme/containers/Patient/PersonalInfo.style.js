import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Colors, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Gutters.regularHMargin,
      ...Gutters.regularTMargin,
    },
    textWrapper: {
      ...Layout.row,
      ...Gutters.regularVPadding,
      borderBottomWidth: 1,
      borderColor: Colors.grey,
    },
    label: {
      ...Layout.fill,
      ...Fonts.textLeft,
    },
    value: {
      ...Fonts.textRight,
      ...Fonts.textBold,
    },
  })
}