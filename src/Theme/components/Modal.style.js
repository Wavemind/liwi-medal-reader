import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Fonts, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      backgroundColor: Colors.secondary,
      borderRadius: 8,
    },
    closeButton: {
      ...Layout.alignItemsEnd,
    },
    header: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Fonts.textCenter,
      ...Gutters.regularVMargin,
      ...Fonts.textUppercase,
      color: Colors.red,
    },
    body: {
      ...Fonts.textSmall,
      ...Fonts.textCenter,
      ...Gutters.largeBMargin,
      ...Gutters.regularHPadding,
    },
    buttonWrapper: {
      ...Layout.row,
      ...Layout.justifyContentAround,
    },
  })
}
