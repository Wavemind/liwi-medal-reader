import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

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
      height: hp(22),
      ...Gutters.largeTMargin,
      ...Layout.center,
    },
    descriptionWrapper: {
      height: hp(11),
      ...Gutters.largeTMargin,
      ...Gutters.regularBMargin,
      ...Layout.center,
    },
  })
}
