import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  return StyleSheet.create({
    booleanButtonWrapper: {
      ...Layout.row,
      width: wp(33.3),
    },
    wrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularTMargin,
      backgroundColor: Colors.whiteToLightBlack,
    },
    diagnosisHeaderWrapper: {
      ...Gutters.regularHPadding,
      ...Gutters.smallVPadding,
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      backgroundColor: Colors.primary,
    },
    diagnosisHeader: {
      ...Fonts.textRegular,
      ...Fonts.textUppercase,
      ...Fonts.textBold,
      color: Colors.secondary,
      width: wp(60),
    },
    diagnosisKey: {
      ...Fonts.textTiny,
      ...Fonts.textUppercase,
      ...Gutters.smallRMargin,
      color: Colors.lightGrey,
    },
    drugsHeader: {
      ...Fonts.textUppercase,
      ...Fonts.textSmall,
      ...Fonts.textBold,
      ...Gutters.regularTMargin,
      color: Colors.grey,
    },
    drugWrapper: isLast => ({
      ...Gutters.regularVPadding,
      borderBottomColor: Colors.grey,
      borderBottomWidth: isLast ? 0 : 1,
    }),
    drugTitleWrapper: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      ...Gutters.smallBMargin,
    },
    drugTitle: {
      ...Fonts.textSmall,
      ...Fonts.textBold,
      width: wp(45),
      color: Colors.primary,
    },
    drugDescription: {
      ...Fonts.textSmall,
      color: Colors.primary,
    },
  })
}
