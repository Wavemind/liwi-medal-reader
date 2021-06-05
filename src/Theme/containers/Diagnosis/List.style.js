import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHMargin,
      ...Layout.fullHeight,
    },
    headerWrapper: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.regularVMargin,
    },
    header: {
      ...Layout.fill,
      ...Fonts.textUppercase,
      ...Fonts.textRegular,
      ...Fonts.textBold,
      color: Colors.grey,
    },
    flatList: {
      ...Layout.grow,
    },
    closeButton: {
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      backgroundColor: Colors.red,
      borderRadius: 10,
    },
  })
}
