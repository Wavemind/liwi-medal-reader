import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    buttonWrapper: open => ({
      ...Gutters.smallTMargin,
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
      ...Layout.row,
      backgroundColor: open ? Colors.primary : Colors.secondary,
      borderWidth: open ? 0 : 1,
      borderBottomLeftRadius: open ? 0 : 10,
      borderBottomRightRadius: open ? 0 : 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderColor: open ? Colors.primary : Colors.grey,
    }),
    buttonTextWrapper: {
      width: wp(75),
    },
    badgeWrapper: {
      ...Layout.center,
      ...Layout.row,
      width: wp(8),
    },
    iconWrapper: {
      ...Layout.center,
      ...Layout.row,
      width: wp(4),
    },
    buttonText: open => ({
      color: open ? Colors.secondary : Colors.primary,
      ...Fonts.textMedium,
      ...Fonts.textBold,
    }),
    badge: open => ({
      backgroundColor: open ? Colors.secondary : Colors.primary,
      borderRadius: 20,
      ...Gutters.tinyVPadding,
      ...Gutters.smallHPadding,
      ...Gutters.smallRMargin,
    }),
    badgeText: open => ({
      color: open ? Colors.primary : Colors.secondary,
      ...Fonts.textTiny,
      ...Fonts.textBold,
    }),
    contentWrapper: open => ({
      backgroundColor: Colors.secondary,
      borderColor: Colors.primary,
      borderWidth: open ? 1 : 0,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      overflow: 'hidden',
    }),
  })
}
