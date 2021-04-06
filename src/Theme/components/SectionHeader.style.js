import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
    },
    before: {
      ...Layout.selfCenter,
      backgroundColor: Colors.black,
      height: 2,
      width: 50,
    },
    label: {
      ...Fonts.textSectionHeader,
      ...Layout.selfCenter,
      ...Gutters.largeHPadding,
    },
    after: {
      ...Layout.selfCenter,
      ...Layout.fill,
      backgroundColor: Colors.black,
      height: 2,
    },
  })
}
