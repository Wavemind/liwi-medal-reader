import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts } = props

  return StyleSheet.create({
    itemStyle: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
    textStyle: {
      ...Fonts.textColorText,
    },
  })
}
