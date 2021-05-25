import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  const base = disabled => ({
    ...Layout.grow,
    ...Gutters.tinyVPadding,
    borderRadius: 5,
    opacity: disabled ? 0.3 : 1,
  })

  const baseText = {
    ...Fonts.textSmall,
    ...Fonts.textCenter,
    ...Fonts.textUppercase,
    ...Fonts.textBold,
  }

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
      ...Layout.fullWidth,
    },
    textWrapper: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.smallVPadding,
    },
    filled: (disabled, color, align) => ({
      ...base(disabled),
      backgroundColor: color !== null ? color : Colors.primary,
      ...Layout.row,
      ...(align !== null ? align : Layout.center),
    }),
    filledText: color => ({
      ...baseText,
      color: color !== null ? color : Colors.white,
    }),
    outlined: (disabled, color, align) => ({
      ...base(disabled),
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.buttonGrey,
      ...(align !== null ? align : Layout.center),
    }),
    outlinedText: color => ({
      ...baseText,
      color: color !== null ? color : Colors.buttonGrey,
    }),
  })
}
