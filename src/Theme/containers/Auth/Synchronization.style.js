import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters } = props

  return StyleSheet.create({
    buttonWrapper: {
      ...Layout.colVCenter,
    },
    loaderContainer: {
      ...Gutters.hugeBMargin,
      ...Layout.center,
    },
    errorMessageWrapper: {
      height: 200,
      ...Gutters.largeTMargin,
      ...Layout.center,
    },
    descriptionWrapper: {
      height: 100,
      ...Gutters.largeTMargin,
      ...Gutters.regularBMargin,
      ...Layout.center,
    },
  })
}
