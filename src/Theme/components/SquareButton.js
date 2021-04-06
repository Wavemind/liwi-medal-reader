import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  const wrapper = {
    ...Layout.row,
    ...Layout.fullWidth,
  }

  const base = disabled => ({
    borderRadius: 5,
    opacity: disabled ? 0.3 : 1,
    ...Layout.grow,
    ...Gutters.smallVPadding,
  })

  const baseText = {
    ...Fonts.textSmall,
    ...Fonts.textCenter,
    ...Fonts.textUppercase,
  }

  return StyleSheet.create({
    wrapper,
    filled: disabled => ({
      ...base(disabled),
      backgroundColor: Colors.buttonGrey,
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
