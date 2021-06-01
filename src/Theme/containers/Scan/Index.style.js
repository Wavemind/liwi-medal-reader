import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Layout, Fonts, Gutters, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.center,
      backgroundColor: Colors.transparent,
    },
    titleWrapper: error => ({
      ...Layout.fill,
      ...Layout.center,
      height: wp(100),
      width: wp(100),
      backgroundColor:
        error?.status === 'error'
          ? Colors.redLowOpacity
          : Colors.primaryLowOpacity,
    }),
    title: {
      ...Fonts.textUppercase,
      ...Fonts.titleSmall,
      color: 'white',
    },
    leftScan: error => ({
      height: wp(65),
      width: wp(100),
      backgroundColor:
        error?.status === 'error'
          ? Colors.redLowOpacity
          : Colors.primaryLowOpacity,
    }),
    centerScan: {
      ...Layout.center,
      height: wp(65),
      width: wp(65),
      backgroundColor: Colors.transparent,
    },
    rightScan: error => ({
      height: wp(65),
      width: wp(100),
      backgroundColor:
        error?.status === 'error'
          ? Colors.redLowOpacity
          : Colors.primaryLowOpacity,
    }),
    bottomWrapper: error => ({
      ...Layout.fill,
      height: wp(100),
      width: wp(100),
      backgroundColor:
        error?.status === 'error'
          ? Colors.redLowOpacity
          : Colors.primaryLowOpacity,

      paddingBottom: wp(25),
    }),
    errorWrapper: {
      ...Layout.fill,
      ...Layout.center,
      ...Gutters.hugeTMargin,
      ...Gutters.hugeHMargin,
      ...Gutters.smallHPadding,
      ...Gutters.smallVPadding,
      backgroundColor: Colors.red,
      borderRadius: 20,
    },
    errorTitle: {
      ...Fonts.textRegular,
      color: Colors.secondary,
    },
  })
}
