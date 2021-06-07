import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  return StyleSheet.create({
    booleanButtonWrapper: {
      width: wp(33.3),
      flexDirection: 'row',
    },
    wrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularTMargin,
      backgroundColor: Colors.secondary,
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
    },
    diagnosisType: {
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
    },
  })
}
