import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, FontSize, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    container: {
      display: 'flex',
      backgroundColor: Colors.secondary,
      borderColor: Colors.grey,
      borderTopWidth: 1,
      ...Layout.row,
    },
    stageWrapperContainer: {
      ...Gutters.smallVPadding,
      ...Gutters.smallHPadding,
      ...Layout.fill,
      ...Layout.row,
    },
    errorContainer: {
      ...Gutters.smallVPadding,
      ...Gutters.smallHPadding,
      ...Layout.fill,
      ...Layout.row,
      backgroundColor: Colors.red,
    },
    errorButtonWrapper: {
      ...Layout.row,
      width: wp(12),
    },
    errorText: {
      ...Fonts.textLeft,
      ...Fonts.textRegular,
      color: Colors.secondary,
    },
    errorNumber: {
      ...Layout.alignItemsCenter,
      ...Fonts.textRight,
      ...Fonts.textRegular,
      color: Colors.secondary,
    },
    errorNextButton: {
      width: wp(5),
    },
    emergencyContainer: {
      flexBasis: 70,
      ...Layout.center,
    },
    emergencyWrapper: {
      ...Gutters.tinyVMargin,
      display: 'flex',
      borderRadius: hp(5.5),
      height: hp(5.5),
      width: hp(5.5),
      backgroundColor: Colors.red,
      ...Layout.row,
      ...Layout.center,
    },
    emergency: {
      fontSize: FontSize.large,
      color: Colors.secondary,
      ...Layout.selfCenter,
    },
    actions: {
      ...Layout.fill,
      ...Layout.rowCenter,
    },
    actionButton: {
      ...Layout.fill,
      ...Gutters.smallHMargin,
    },
  })
}
