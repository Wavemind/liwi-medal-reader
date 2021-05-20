import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  const base = disabled => ({
    ...Layout.grow,
    ...Gutters.smallVPadding,
    borderRadius: 5,
    opacity: disabled ? 0.3 : 1,
  })

  const baseText = {
    ...Fonts.textSmall,
    ...Fonts.textCenter,
    ...Fonts.textUppercase,
  }

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
      ...Layout.fullWidth,
    },
    textWrapper: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.tinyVPadding,
    },
    filled: disabled => ({
      ...base(disabled),
      backgroundColor: Colors.primary,
    }),
    filledText: {
      ...baseText,
      color: Colors.white,
    },
    outlined: disabled => ({
      ...base(disabled),
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.buttonGrey,
    }),
    outlinedText: {
      ...baseText,
      color: Colors.buttonGrey,
    },
  })
}
