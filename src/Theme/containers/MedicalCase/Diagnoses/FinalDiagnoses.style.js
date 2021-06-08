import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  return StyleSheet.create({
    newItemWrapper: isLastItem => ({
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      borderBottomColor: Colors.grey,
      borderBottomWidth: isLastItem ? 0 : 1,
    }),
    booleanButtonWrapper: {
      width: wp(33.3),
      flexDirection: 'row',
    },
    addAdditionalButton: {
      ...Gutters.smallTMargin,
      ...Gutters.regularBMargin,
      ...Gutters.tinyVPadding,
      ...Gutters.regularHPadding,
      ...Layout.row,
      backgroundColor: Colors.secondary,
      borderColor: Colors.grey,
      borderWidth: 1,
      borderRadius: hp(2),
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
    addCustomWrapper: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
    addCustomInputText: {
      ...Gutters.regularHPadding,
      ...Gutters.regularRMargin,
      ...Layout.grow,
      borderWidth: 1,
      borderColor: Colors.grey,
      backgroundColor: Colors.secondary,
      borderRadius: hp(2),
      height: hp(4),
    },
  })
}
