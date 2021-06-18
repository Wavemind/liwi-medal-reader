import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Gutters, Colors, Layout, Fonts } = props

  return StyleSheet.create({
    buttonWrapper: open => ({
      ...Gutters.smallTMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      backgroundColor: Colors.primary,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      borderBottomRightRadius: open ? 0 : 10,
      borderBottomLeftRadius: open ? 0 : 10,
      borderWidth: 1,
      borderBottomWidth: open ? 0 : 1,
      borderColor: Colors.primary,
    }),
    contentWrapper: (open, height) => ({
      backgroundColor: Colors.secondary,
      borderColor: Colors.primary,
      borderWidth: open ? 1 : 0,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      overflow: 'hidden',
      height: height,
    }),
    inputWrapper: {
      ...Gutters.smallHMargin,
      ...Gutters.tinyVMargin,
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      ...Layout.grow,
      backgroundColor: Colors.secondary,
      borderWidth: 1,
      borderColor: Colors.grey,
      height: hp(6),
      borderRadius: 10,
    },
    inputText: {
      ...Fonts.textSmall,
      ...Layout.grow,
      color: Colors.grey,
      padding: 0,
    },
    selectWrapper: {
      ...Layout.rowHCenter,
      ...Gutters.smallHMargin,
      ...Layout.justifyContentBetween,
    },
  })
}
