import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.colCenter,
      marginBottom: 100,
      marginTop: 100,
    },
    animation: fadeAnim => ({
      ...Layout.fill,
      ...Layout.center,
      ...Layout.justifyContentBetween,
      width: 400,
      opacity: fadeAnim,
    }),
    header: {
      ...Fonts.textColorText,
      ...Fonts.titleSmall,
    },
    errorMessage: {
      ...Fonts.textRegular,
    },
    switchOuterWrapper: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentCenter,
    },
    switchInnerWrapper: {
      ...Layout.alignItemsCenter,
    },
    switchLabel: {
      ...Fonts.textSmall,
      marginRight: 30,
      color: Colors.text,
    },
  })
}
