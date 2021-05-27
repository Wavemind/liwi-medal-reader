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
    titleWrapper: {
      ...Layout.fill,
      ...Layout.center,
      height: wp(100),
      width: wp(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
      ...Fonts.textUppercase,
      ...Fonts.titleSmall,
      color: 'white',
    },
    leftScan: {
      height: wp(65),
      width: wp(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    centerScan: {
      ...Layout.center,
      height: wp(65),
      width: wp(65),
      backgroundColor: Colors.transparent,
    },
    rightScan: {
      height: wp(65),
      width: wp(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomWrapper: {
      ...Layout.fill,
      height: wp(100),
      width: wp(100),
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingBottom: wp(25),
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
