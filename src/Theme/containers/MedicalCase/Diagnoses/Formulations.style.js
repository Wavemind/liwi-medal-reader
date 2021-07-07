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
    formulationsHeaderWrapper: {
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      backgroundColor: Colors.primary,
    },
    formulationsHeader: {
      ...Fonts.textSmall,
      ...Fonts.textUppercase,
      ...Fonts.textBold,
      color: Colors.secondary,
    },
    drugWrapper: isLast => ({
      ...Gutters.smallVMargin,
      ...Gutters.smallVPadding,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: Colors.grey,
    }),
    leftColumn: {
      width: wp(48),
    },
    label: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      color: Colors.primary,
    },
    relatedDiagnoses: {
      ...Fonts.textSmall,
      color: Colors.primary,
    },
    rightColumn: {
      width: wp(30),
    },
    pickerWrapper: {
      ...Layout.justifyContentCenter,
      backgroundColor: Colors.secondary,
      height: hp(4.4),
      borderRadius: 20,
      borderColor: Colors.grey,
      borderWidth: 1,
    },
    picker: {
      width: wp(29),
      color: Colors.primary,
    },
    selectedFormulationText: {
      ...Fonts.textTiny,
      ...Fonts.textBold,
      ...Gutters.tinyVMargin,
      color: Colors.primary,
    },
  })
}
