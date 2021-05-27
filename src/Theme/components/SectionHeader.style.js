import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

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
      width: wp(8.2),
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
