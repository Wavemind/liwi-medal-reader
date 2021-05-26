import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  const base = (disabled, big) => ({
    ...Layout.grow,
    ...(big ? Gutters.regularVPadding : Gutters.tinyVPadding),
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
    filled: (disabled, color, align, big) => ({
      ...base(disabled, big),
      backgroundColor: color !== null ? color : Colors.primary,
      ...Layout.row,
      ...(align !== null ? align : Layout.center),
    }),
    filledText: color => ({
      ...baseText,
      color: color !== null ? color : Colors.secondary,
    }),
    outlined: (disabled, color, align, big) => ({
      ...base(disabled, big),
      backgroundColor: color !== null ? color : 'transparent',
      borderWidth: 1,
      borderColor: Colors.grey,
      ...(align !== null ? align : Layout.center),
    }),
    outlinedText: color => ({
      ...baseText,
      color: color !== null ? color : Colors.grey,
    }),
    iconLeft: big => ({
      ...(big ? Gutters.smallRMargin : null),
    }),
    iconRight: big => ({
      ...(big ? Gutters.smallLMargin : null),
    }),
  })
}
