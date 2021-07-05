import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: (fullWidth, label) => ({
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
      ...(label ? Gutters.regularVPadding : Gutters.tinyVMargin),
      ...(fullWidth ? Layout.fullWidth : null),
      position: 'relative',
      flex: label ? 0 : 1,
    }),
    label: {
      ...Fonts.textSmall,
      color: Colors.text,
    },
    pickerContainer: (withBorder, pickerGrow) => ({
      ...Layout.justifyContentCenter,
      backgroundColor: Colors.white,
      opacity: 1,
      borderColor: Colors.grey,
      borderRadius: 10,
      borderWidth: withBorder ? 1 : 0,
      flexGrow: pickerGrow ? 1 : 0,
      height: pickerGrow ? 'auto' : hp(4.4),
    }),
    picker: {
      minWidth: wp(28.3),
      color: Colors.black,
    },
  })
}
