import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Gutters, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularVPadding,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
      position: 'relative',
    },
    label: {
      ...Fonts.textSmall,
      color: Colors.text,
    },
    pickerContainer: {
      backgroundColor: 'white',
      height: 40,
      opacity: 1,
      justifyContent: 'center',
      borderRadius: 10,
    },
    picker: {
      width: 170,
      color: Colors.primary,
    },
  })
}
