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
      backgroundColor: Colors.secondary,
      height: 60,
      ...Gutters.regularTMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      width: '100%',
      borderRadius: 20,
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
