import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters } = props

  return StyleSheet.create({
    formWrapper: {
      width: '100%',
      ...Layout.center,
      ...Gutters.largeBMargin,
    },
    input: {
      backgroundColor: Colors.white,
      height: 40,
      marginTop: 12,
      width: '100%',
      borderWidth: 1,
      color: Colors.black,
      paddingHorizontal: 10,
    },
    buttonWrapper: {
      ...Gutters.largeTMargin,
    },
    errorMessageWrapper: {
      height: 50,
      ...Gutters.hugeTMargin,
      ...Gutters.regularBMargin,
      ...Layout.center,
    },
    loaderContainer: {
      height: 100,
      ...Gutters.hugeBMargin,
      ...Layout.center,
    },
  })
}
