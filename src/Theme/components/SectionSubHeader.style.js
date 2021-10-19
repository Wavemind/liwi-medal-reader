import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.row,
      ...Gutters.regularVMargin,
    },
    label: {
      ...Fonts.textSectionSubHeader,
      color: Colors.primary,
    },
  })
}
