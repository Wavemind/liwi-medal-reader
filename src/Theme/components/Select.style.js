import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: warning => ({
      ...Gutters.regularVPadding,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
      position: 'relative',
      borderBottomWidth: 1,
      borderBottomColor: Colors.grey,
      backgroundColor: warning ? Colors.secondary : Colors.transparent,
    }),
    label: warning => ({
      ...Fonts.textRegular,
      color: warning ? Colors.primary : Colors.text,
    }),
    pickerContainer: disabled => ({
      backgroundColor: Colors.secondary,
      height: Math.round(heightPercentageToDP(4.4)),
      borderRadius: 20,
      opacity: disabled ? 0.5 : 1,
      justifyContent: 'center',
    }),
    picker: {
      width: Math.round(widthPercentageToDP(33.3)),
      color: Colors.primary,
    },
  })
}
