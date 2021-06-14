import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  const labelWidth = wp(50)
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
      backgroundColor: Colors.lightGrey,
    },
    itemLabelWrapper: {
      ...Layout.row,
      ...Layout.alignItemsStart,
      width: labelWidth,
    },
    itemLabel: {
      ...Fonts.textSmall,
      ...Gutters.smallRMargin,
    },
    addAdditionalButton: {
      ...Gutters.smallTMargin,
      ...Gutters.regularBMargin,
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