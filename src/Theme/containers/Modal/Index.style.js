import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Colors, Gutters } = props

  const buttonDimensions = 50

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.col,
    },
    closeButtonWrapper: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
    },
    closeButton: {
      backgroundColor: Colors.primary,
      height: buttonDimensions,
      width: buttonDimensions,
      borderRadius: buttonDimensions / 2,
    },
    closeButtonText: {
      ...Layout.fill,
      ...Layout.fullHeight,
      ...Fonts.textCenter,
      color: Colors.white,
      textAlignVertical: 'center',
      fontSize: 25,
    },
  })
}
