import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    newItemWrapper: isLastItem => ({
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      borderBottomColor: Colors.grey,
      borderBottomWidth: isLastItem ? 0 : 1,
    }),
    diagnosisLabel: {
      ...Fonts.textSmall,
      color: Colors.primary,
      width: wp(40),
    },
    booleanButtonWrapper: {
      ...Layout.row,
      ...Gutters.smallLMargin,
      width: wp(33.3),
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
      borderRadius: hp(2.5),
      height: hp(5),
      color: Colors.primary,
    },
    noItemsText: {
      ...Gutters.smallVPadding,
      ...Fonts.textCenter,
      ...Fonts.textSmall,
      ...Fonts.textItalic,
      color: Colors.primary,
    },
  })
}
