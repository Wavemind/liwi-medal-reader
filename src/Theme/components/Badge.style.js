import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors, Layout } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.center,
      ...Layout.row,
      ...Gutters.tinyHPadding,
      ...Gutters.tinyHMargin,
      backgroundColor: Colors.primary,
      borderRadius: 5,
    },
    innerWrapper: {
      ...Gutters.tinyVPadding,
      ...Layout.row,
    },
    separator: {
      ...Gutters.tinyHMargin,
      width: 1,
      backgroundColor: Colors.secondary,
      height: '100%',
    },
  })
}
