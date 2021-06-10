import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Layout, Gutters, Fonts, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHMargin,
      ...Layout.grow,
      height: hp(89),
    },
    headerWrapper: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.regularVMargin,
    },
    header: {
      ...Layout.fill,
      ...Fonts.textUppercase,
      ...Fonts.textRegular,
      ...Fonts.textBold,
      color: Colors.grey,
    },
    closeButton: {
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      backgroundColor: Colors.red,
      borderRadius: 10,
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
    },
    clearFiltersButton: {
      ...Gutters.regularRPadding,
      ...Layout.row,
    },
    clearFiltersButtonWrapper: {
      ...Layout.row,
      ...Layout.center,
      ...Gutters.tinyVPadding,
    },
    clearFiltersButtonText: {
      ...Fonts.textTiny,
      ...Fonts.textCenter,
      ...Fonts.textBold,
      color: Colors.red,
    },
  })
}
