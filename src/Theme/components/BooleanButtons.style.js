import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.largeTMargin,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
    },
    label: {
      ...Fonts.textRegular,
    },
    buttonsWrapper: {
      ...Layout.justifyContentAround,
      ...Layout.row,
      width: 200,
    },
    buttonWrapper: (side, active) => ({
      ...Layout.fill,
      backgroundColor: active ? Colors.primary : Colors.white,
      borderBottomLeftRadius: side === 'left' ? 20 : 0,
      borderTopLeftRadius: side === 'left' ? 20 : 0,
      borderBottomRightRadius: side === 'right' ? 20 : 0,
      borderTopRightRadius: side === 'right' ? 20 : 0,
      borderRightWidth: side === 'left' ? 1 : 0,
    }),
    buttonText: active => ({
      ...Gutters.smallVPadding,
      color: active ? Colors.white : Colors.black,
    }),
  })
}
