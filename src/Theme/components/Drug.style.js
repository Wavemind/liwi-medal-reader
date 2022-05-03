import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    border: isLast => ({
      borderBottomColor: Colors.grey,
      borderBottomWidth: isLast ? 0 : 1,
    }),
    buttonWrapper: {
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
      ...Layout.row,
    },
    customContainer: {
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      ...Layout.justifyContentBetween,
    },
    buttonTextWrapper: {
      width: wp(75),
    },
    iconWrapper: {
      ...Layout.center,
      ...Layout.row,
      width: wp(4),
    },
    buttonInfo: {
      ...Layout.flex,
      ...Layout.alignItemsEnd,
    },
    buttonText: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      maxWidth: wp(70),
      color: Colors.primary,
    },
    drugText: {
      ...Fonts.textTiny,
      color: Colors.primary,
      lineHeight: 27,
    },
    contentWrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularBMargin,
      overflow: 'hidden',
    },
  })
}
