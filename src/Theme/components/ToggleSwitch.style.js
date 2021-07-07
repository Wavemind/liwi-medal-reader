import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularVPadding,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
      position: 'relative',
    },
    label: {
      ...Fonts.textSmall,
      color: Colors.primary,
    },
    switchContainer: {
      ...Layout.justifyContentCenter,
      backgroundColor: Colors.whiteToLightBlack,
      height: hp(4.4),
      opacity: 1,
      borderRadius: 10,
    },
  })
}
