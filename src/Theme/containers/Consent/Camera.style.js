import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, FontSize, Colors } = props

  return StyleSheet.create({
    container: {
      backgroundColor: Colors.black,
      ...Layout.fill,
      ...Layout.fullSize,
    },
    camera: {
      ...Layout.fill,
      ...Layout.fullSize,
    },
    takePhotoButton: {
      ...Layout.selfCenter,
      position: 'absolute',
      bottom: 40,
    },
    takePhotoIcon: {
      color: Colors.white,
      fontSize: FontSize.huge,
      opacity: 0.7,
    },
    sideIcon: {
      color: Colors.white,
      fontSize: FontSize.big,
    },
    buttonWrapper: {
      position: 'absolute',
      right: 20,
      top: 20,
    },
    actionButtons: {
      ...Gutters.largeBMargin,
      ...Layout.center,
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      backgroundColor: Colors.greyTransparent,
    },
  })
}
