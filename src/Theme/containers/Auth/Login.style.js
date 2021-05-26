import { StyleSheet } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'

export default function (props) {
  const { Colors, Layout, Gutters } = props

  return StyleSheet.create({
    formWrapper: {
      width: '100%',
      ...Layout.center,
      ...Gutters.largeBMargin,
    },
    input: {
      height: Math.round(heightPercentageToDP(7)),
      ...Gutters.regularTMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      width: '100%',
      borderRadius: 10,
      backgroundColor: Colors.secondary,
      borderWidth: 1,
      borderColor: Colors.grey,
    },
    buttonWrapper: {
      ...Gutters.largeTMargin,
    },
    errorMessageWrapper: {
      height: Math.round(heightPercentageToDP(4)),
      ...Gutters.hugeTMargin,
      ...Gutters.regularBMargin,
      ...Layout.center,
    },
    loaderContainer: {
      height: Math.round(heightPercentageToDP(11)),
      ...Gutters.hugeBMargin,
      ...Layout.center,
    },
  })
}
