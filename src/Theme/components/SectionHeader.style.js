import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
      ...Gutters.regularVMargin,
    },
    before: {
      ...Layout.selfCenter,
      backgroundColor: Colors.text,
      height: 2,
      width: 50,
    },
    label: {
      ...Fonts.textSectionHeader,
      ...Gutters.largeRPadding,
      color: Colors.text,
    },
    after: {
      ...Layout.selfCenter,
      ...Layout.fill,
      backgroundColor: Colors.text,
      height: 2,
    },
  })
}
