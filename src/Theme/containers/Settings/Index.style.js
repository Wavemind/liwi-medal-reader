import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Gutters, Colors } = props

  return StyleSheet.create({
    title: {
      ...Gutters.regularLMargin,
      ...Gutters.regularVMargin,
      ...Fonts.textSectionHeader,
      color: Colors.primary,
    },
    item: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      backgroundColor: Colors.secondary,
      borderTopWidth: 1,
      borderTopColor: Colors.grey,
    },
    itemGeneral: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.regularHPadding,
      backgroundColor: Colors.secondary,
      borderTopWidth: 1,
      borderTopColor: Colors.grey,
    },
    text: {
      ...Fonts.textColorText,
      ...Fonts.textSmall,
    },
  })
}
