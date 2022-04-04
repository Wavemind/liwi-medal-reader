import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts, FontSize } = props

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.lightGrey,
    },
    video: {
      height: wp(100) * (9 / 16),
      width: wp(100),
      backgroundColor: 'black',
    },
    fullscreenVideo: {
      height: wp(100),
      width: wp(100),
      backgroundColor: 'black',
    },
    text: {
      ...Gutters.regularHpMargin,
      ...Fonts.textRegular,
      textAlign: 'justify',
    },
    fullscreenButton: {
      ...Layout.fill,
      ...Layout.row,
      alignSelf: 'flex-end',
      ...Layout.alignItemsCenter,
      ...Gutters.smallRPadding,
    },
    controlOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#000000c4',
      ...Layout.justifyContentBetween,
    },

    wrapper: {
      ...Layout.fill,
    },
    timeWrapper: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Layout.justifyContentBetween,
      ...Gutters.smallHPadding,
    },
    timeLeft: {
      ...Layout.fill,
      color: Colors.secondary,
      ...Fonts.smallText,
      ...Gutters.smallLPadding,
    },
    timeRight: {
      ...Layout.fill,
      ...Fonts.smallText,
      color: Colors.secondary,
      ...Gutters.smallRPadding,
      ...Fonts.textRight,
    },

    wrapperControls: {
      ...Gutters.regularHPadding,
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Layout.justifyContentEvenly,
      flex: 3,
    },

    touchable: {
      ...Gutters.smallHPadding,
      ...Gutters.smallVPadding,
    },

    touchableDisabled: {
      opacity: 0.3,
    },

    icon: {
      fontSize: FontSize.large,
      color: Colors.secondary,
    },
  })
}
