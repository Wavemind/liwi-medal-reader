import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  const loginWidth = 400

  return StyleSheet.create({
    header: {
      ...Fonts.textColorText,
      ...Fonts.titleSmall,
      marginBottom: 130,
    },
    formWrapper: {
      ...Layout.colVCenter,
      width: loginWidth,
      marginTop: 100,
    },
    input: {
      backgroundColor: Colors.white,
      height: 40,
      width: loginWidth,
      marginTop: 12,
      borderWidth: 1,
      color: Colors.black,
      paddingHorizontal: 10,
    },
    buttonWrapper: {
      marginTop: 30,
    },
    errorMessage: {
      ...Fonts.textRegular,
    },
    switchOuterWrapper: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentCenter,
      marginBottom: 100,
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
