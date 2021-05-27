import { StyleSheet } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'

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
      height: Math.round(heightPercentageToDP(22)),
      ...Gutters.largeTMargin,
      ...Layout.center,
    },
    descriptionWrapper: {
      height: Math.round(heightPercentageToDP(11)),
      ...Gutters.largeTMargin,
      ...Gutters.regularBMargin,
      ...Layout.center,
    },
  })
}
