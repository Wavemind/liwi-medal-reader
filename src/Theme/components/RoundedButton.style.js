import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
      ...Layout.fullWidth,
    },
    base: disabled => ({
      ...Gutters.smallVPadding,
      ...Gutters.largeHPadding,
      borderRadius: 30,
      backgroundColor: disabled ? Colors.grey : Colors.primary,
    }),
    content: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Layout.justifyContentBetween,
    },
    baseText: {
      ...Fonts.textSmall,
      ...Fonts.textCenter,
      ...Fonts.textUppercase,
      color: Colors.secondary,
    },
  })
}
