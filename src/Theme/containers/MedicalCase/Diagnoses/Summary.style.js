import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Fonts, Gutters, Layout } = props

  return StyleSheet.create({
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
      maxWidth: wp(60),
    },
    diagnosisKey: {
      ...Fonts.textTiny,
      ...Fonts.textUppercase,
      ...Gutters.smallRMargin,
      color: Colors.lightGrey,
    },
    drugsHeader: {
      ...Fonts.textUppercase,
      ...Fonts.textRegular,
      ...Fonts.textBold,
      color: Colors.grey,
    },
    drugWrapper: isLast => ({
      ...Gutters.regularVPadding,
      borderBottomColor: Colors.grey,
      borderBottomWidth: isLast ? 0 : 1,
    }),
    drugTitleWrapper: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentStart,
      ...Gutters.smallBMargin,
    },
    drugTitle: {
      ...Fonts.textSmall,
      ...Fonts.textBold,
      maxWidth: wp(60),
    },
  })
}
