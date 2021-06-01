import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: warning => ({
      ...Gutters.regularVPadding,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
      position: 'relative',
      borderBottomWidth: 1,
      borderBottomColor: Colors.grey,
      backgroundColor: warning ? Colors.secondary : Colors.transparent,
    }),
    pickerContainer: disabled => ({
      backgroundColor: Colors.secondary,
      height: hp(4.4),
      borderRadius: 20,
      opacity: disabled ? 0.5 : 1,
      justifyContent: 'center',
    }),
    picker: {
      width: wp(33.3),
      color: Colors.primary,
    },
  })
}
