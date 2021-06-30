import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    formWrapper: {
      width: '100%',
      ...Layout.center,
      ...Gutters.largeBMargin,
    },
    input: {
      height: hp(7),
      ...Gutters.regularTMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      ...Fonts.textSmall,
      width: '100%',
      borderRadius: 10,
      backgroundColor: Colors.secondary,
      borderWidth: 1,
      borderColor: Colors.grey,
      color: Colors.primary,
    },
    buttonWrapper: {
      ...Gutters.largeTMargin,
    },
    errorMessageWrapper: {
      height: hp(4),
      ...Gutters.hugeTMargin,
      ...Gutters.regularBMargin,
      ...Layout.center,
    },
    loaderContainer: {
      height: hp(11),
      ...Gutters.hugeBMargin,
      ...Layout.center,
    },
  })
}
