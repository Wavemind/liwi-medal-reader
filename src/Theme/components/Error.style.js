import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Fonts, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.row,
      backgroundColor: Colors.red,
      borderRadius: 5,
    },
    message: {
      ...Fonts.textSmall,
      color: Colors.secondary,
    },
  })
}
