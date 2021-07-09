import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Layout, Fonts, Gutters, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.grow,
      height: hp(89),
    },
    header: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.regularTMargin,
    },
    scrollViewWrapper: {
      ...Layout.grow,
      ...Gutters.regularBPadding,
      height: hp(82),
    },
    title: {
      ...Layout.fill,
      ...Fonts.textUppercase,
      ...Fonts.textRegular,
      ...Fonts.textBold,
      color: Colors.grey,
    },
    button: {
      backgroundColor: Colors.red,
      borderRadius: 10,
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
    },
    footerWrapper: {
      ...Gutters.tinyVPadding,
      ...Gutters.regularHPadding,
      ...Layout.row,
      ...Layout.justifyContentEnd,
      width: wp(100),
      backgroundColor: Colors.secondary,
      borderTopWidth: 1,
      borderTopColor: Colors.grey,
      position: 'absolute',
      bottom: 0,
    },
  })
}
