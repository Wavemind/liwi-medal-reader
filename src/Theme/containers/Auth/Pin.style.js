import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.center,
    },
    title: {
      ...Fonts.textColorText,
      ...Fonts.textRegular,
    },
    delete: {
      ...Fonts.textSmall,
    },
    codeButtons: {
      ...Layout.center,
      height: 150,
    },
  })
}
