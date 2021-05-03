import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  const loginWidth = 300

  return StyleSheet.create({
    header: {
      ...Fonts.textColorText,
      ...Fonts.titleSmall,
    },
    formWrapper: {
      ...Layout.colVCenter,
      width: loginWidth,
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
      marginTop: 12,
    },
    errorMessage: {
      ...Fonts.textRegular,
    },
    switchWrapper: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchLabel: {
      color: Colors.text,
    },
  })
}
