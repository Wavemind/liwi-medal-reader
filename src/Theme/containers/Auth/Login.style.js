import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    formWrapper: {
      ...Layout.center,
      ...Gutters.largeVMargin,
      height: hp(70),
    },
    input: {
      height: hp(7),
      ...Gutters.regularTMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      ...Fonts.textSmall,
      width: '100%',
      borderRadius: 10,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.grey,
      color: Colors.black,
    },
    buttonWrapper: {
      ...Gutters.largeTMargin,
    },
    loaderWrapper: {
      width: wp(20),
      height: hp(20),
    },
    errorMessageWrapper: {
      height: hp(4),
      ...Gutters.hugeTMargin,
      ...Gutters.regularBMargin,
      ...Layout.center,
    },
  })
}
