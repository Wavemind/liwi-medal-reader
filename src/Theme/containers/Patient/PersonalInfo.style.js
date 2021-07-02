import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Layout, Gutters, Colors, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHMargin,
    },
    textWrapper: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.regularVPadding,
      borderBottomWidth: 1,
      borderColor: Colors.grey,
    },
    labelWrapper: {
      ...Layout.rowHCenter,
      ...Layout.fill,
      ...Layout.justifyContentStart,
    },
    label: {
      ...Fonts.textLeft,
      ...Fonts.textSmall,
      ...Gutters.smallHMargin,
      maxWidth: wp(50),
    },
    value: {
      ...Fonts.textRight,
      ...Fonts.textSmall,
      ...Fonts.textBold,
    },
  })
}
