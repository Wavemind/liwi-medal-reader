import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  const labelWidth = wp(42)
  const inputWidth = wp(18)

  return StyleSheet.create({
    headerWrapper: {
      ...Layout.row,
      ...Gutters.regularHPadding,
    },
    headerSpacer: {
      ...Gutters.regularRMargin,
      width: labelWidth,
    },
    durationLabel: {
      ...Fonts.textTiny,
      ...Fonts.textCenter,
      color: Colors.grey,
      width: inputWidth,
    },
    durationWrapper: {
      height: hp(5),
    },
    durationInput: {
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      ...Fonts.textSmall,
      ...Fonts.textCenter,
      ...Layout.fill,
      width: inputWidth,
      borderRadius: 30,
      borderColor: Colors.primary,
      borderWidth: 1,
      backgroundColor: Colors.white,
      color: Colors.black,
    },
    itemLabelWrapper: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
      width: labelWidth,
    },
    itemLabel: {
      ...Fonts.textSmall,
      ...Gutters.smallRMargin,
      color: Colors.primary,
      width: wp(40),
    },
    addAdditionalWrapper: {
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      borderBottomColor: Colors.grey,
      borderBottomWidth: 1,
    },
    addAdditionalButton: {
      ...Gutters.smallTMargin,
      ...Gutters.smallVPadding,
      ...Gutters.regularHPadding,
      ...Layout.row,
      backgroundColor: Colors.secondary,
      borderColor: Colors.grey,
      borderWidth: 1,
      borderRadius: hp(3),
    },
    addAdditionalButtonText: {
      ...Layout.grow,
      ...Fonts.textSmall,
      color: Colors.primary,
    },
    addAdditionalButtonCountWrapper: {
      ...Layout.rowVCenter,
      backgroundColor: Colors.primary,
      borderRadius: hp(1.5),
      width: hp(3),
      height: hp(3),
    },
    addAdditionalButtonCountText: {
      ...Fonts.textSmall,
      color: Colors.secondary,
    },
  })
}
