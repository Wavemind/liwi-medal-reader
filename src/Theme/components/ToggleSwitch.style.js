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
      color: Colors.text,
    },
    switchContainer: {
      backgroundColor: Colors.secondary,
      height: hp(4.4),
      opacity: 1,
      justifyContent: 'center',
      borderRadius: 10,
    },
  })
}
