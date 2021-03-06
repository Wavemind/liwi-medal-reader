import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularVMargin,
      backgroundColor: Colors.whiteToLightBlack,
    },
    headerWrapper: {
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      backgroundColor: Colors.primary,
    },
    header: {
      ...Fonts.textSmall,
      ...Fonts.textUppercase,
      ...Fonts.textBold,
      color: Colors.secondary,
    },
    innerWrapper: isLast => ({
      ...Gutters.smallVMargin,
      ...Gutters.smallVPadding,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: Colors.grey,
    }),
    additionalWrapper: {
      ...Gutters.smallVMargin,
      ...Gutters.tinyVPadding,
      borderBottomWidth: 1,
      borderBottomColor: Colors.grey,
    },
    indication: {
      ...Fonts.textBold,
      ...Fonts.textSmall,
      color: Colors.grey,
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
    drugTitleWrapper: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      ...Gutters.smallBMargin,
    },
    drugTitle: {
      ...Fonts.textSmall,
      ...Fonts.textBold,
      ...Gutters.smallRMargin,
      width: wp(40),
      color: Colors.primary,
    },
    selectRelatedDiagnoses: {
      ...Fonts.textTiny,
      ...Fonts.textCenter,
      width: wp(20),
      color: Colors.red,
    },
    drugDescription: {
      ...Fonts.textSmall,
      color: Colors.primary,
    },
    pickerWrapper: {
      ...Layout.justifyContentCenter,
      ...Gutters.smallTMargin,
      backgroundColor: Colors.secondary,
      height: hp(4.4),
      borderRadius: 20,
      borderColor: Colors.grey,
      borderWidth: 1,
    },
  })
}
