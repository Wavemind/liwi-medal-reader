import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Colors, Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Layout.col,
      backgroundColor: Colors.secondary,
    },
    closeButton: {
      ...Layout.fullWidth,
      backgroundColor: Colors.red,
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '7%',
      zIndex: 2,
    },
    closeButtonText: {
      ...Layout.fill,
      ...Fonts.textCenter,
      ...Fonts.textSectionHeader,
      color: Colors.secondary,
      textAlignVertical: 'center',
    },
    contentWrapper: {
      ...Gutters.smallHPadding,
      ...Gutters.smallTPadding,
      height: '93%',
    },
  })
}
