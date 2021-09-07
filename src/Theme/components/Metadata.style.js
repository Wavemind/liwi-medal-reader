import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts } = props

  return StyleSheet.create({
    column: {
      ...Layout.fill,
      ...Layout.column,
    },
    value: {
      ...Fonts.textSmall,
      ...Fonts.textBold,
      ...Fonts.textRight,
    },
  })
}
