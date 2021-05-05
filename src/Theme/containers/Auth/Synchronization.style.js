import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters } = props

  return StyleSheet.create({
    buttonWrapper: {
      ...Layout.colVCenter,
    },
    loaderContainer: {
      height: 200,
      ...Gutters.hugeVMargin,
      ...Layout.center,
    },
    errorMessageWrapper: {
      height: 50,
      ...Gutters.hugeTMargin,
      ...Gutters.regularBMargin,
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
