import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

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
      width: wp(40),
      color: Colors.primary,
    },
    drugDescription: {
      ...Fonts.textSmall,
      color: Colors.primary,
    },
  })
}
