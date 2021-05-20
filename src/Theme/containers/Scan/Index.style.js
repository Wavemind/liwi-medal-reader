import { StyleSheet, Dimensions } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Gutters, Colors } = props

  const WIDTH = Dimensions.get('window').width

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    titleWrapper: {
      ...Layout.fill,
      ...Layout.center,
      height: WIDTH,
      width: WIDTH,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
      ...Fonts.textUppercase,
      ...Fonts.titleSmall,
      color: 'white',
    },
    leftScan: {
      height: WIDTH * 0.65,
      width: WIDTH,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    centerScan: {
      ...Layout.center,
      height: WIDTH * 0.65,
      width: WIDTH * 0.65,
      backgroundColor: 'transparent',
    },
    rightScan: {
      height: WIDTH * 0.65,
      width: WIDTH,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomWrapper: {
      ...Layout.fill,
      height: WIDTH,
      width: WIDTH,
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingBottom: WIDTH * 0.25,
    },
    errorWrapper: {
      ...Layout.fill,
      ...Layout.center,
      ...Gutters.hugeTMargin,
      ...Gutters.hugeHMargin,
      backgroundColor: 'red',
      borderRadius: 20,
    },
    errorTitle: {
      ...Fonts.textRegular,
      color: Colors.secondary,
    },
  })
}
