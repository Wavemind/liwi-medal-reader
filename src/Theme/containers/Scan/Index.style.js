import { StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

export default function (props) {
  const { Layout, Fonts, Gutters, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.center,
      backgroundColor: Colors.transparent,
    },
    titleWrapper: {
      ...Layout.fill,
      ...Layout.center,
      height: widthPercentageToDP(100),
      width: widthPercentageToDP(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
      ...Fonts.textUppercase,
      ...Fonts.titleSmall,
      color: 'white',
    },
    leftScan: {
      height: widthPercentageToDP(65),
      width: widthPercentageToDP(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    centerScan: {
      ...Layout.center,
      height: widthPercentageToDP(65),
      width: widthPercentageToDP(65),
      backgroundColor: Colors.transparent,
    },
    rightScan: {
      height: widthPercentageToDP(65),
      width: widthPercentageToDP(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomWrapper: {
      ...Layout.fill,
      height: widthPercentageToDP(100),
      width: widthPercentageToDP(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingBottom: widthPercentageToDP(25),
    },
    errorWrapper: {
      ...Layout.fill,
      ...Layout.center,
      ...Gutters.hugeTMargin,
      ...Gutters.hugeHMargin,
      backgroundColor: Colors.red,
      borderRadius: 20,
    },
    errorTitle: {
      ...Fonts.textRegular,
      color: Colors.secondary,
    },
  })
}
