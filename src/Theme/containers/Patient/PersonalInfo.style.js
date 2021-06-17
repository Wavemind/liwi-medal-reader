import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters, Colors, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      ...Gutters.regularHMargin,
    },
    textWrapper: {
      ...Layout.row,
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
    },
    value: {
      ...Fonts.textRight,
      ...Fonts.textSmall,
      ...Fonts.textBold,
    },
  })
}
