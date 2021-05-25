import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    buttonWrapper: open => ({
      ...Gutters.smallTMargin,
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
      ...Layout.row,
      backgroundColor: open ? Colors.primary : Colors.secondary,
      borderRadius: 10,
      borderWidth: open ? 0 : 1,
      borderColor: 'grey',
    }),
    buttonText: open => ({
      color: open ? Colors.secondary : Colors.primary,
      ...Fonts.textBold,
      ...Fonts.textMedium,
    }),
    contentWrapper: {
      backgroundColor: Colors.secondary,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      overflow: 'hidden',
    },
  })
}
