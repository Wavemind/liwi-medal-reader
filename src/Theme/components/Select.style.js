import { StyleSheet } from 'react-native'

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
      borderBottomColor: 'lightgrey',
      backgroundColor: warning ? '#FDE7E8' : 'transparent',
    }),
    label: warning => ({
      ...Fonts.textRegular,
      color: warning ? Colors.primary : Colors.text,
    }),
    pickerContainer: disabled => ({
      backgroundColor: 'white',
      height: 40,
      borderRadius: 20,
      opacity: disabled ? 0.5 : 1,
      justifyContent: 'center',
    }),
    picker: {
      width: 200,
      color: Colors.primary,
    },
  })
}
