import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Fonts } = props

  return StyleSheet.create({
    wrapper: {
      backgroundColor: Colors.secondary,
      borderRadius: 8,
      padding: 20,
    },
    closeButton: {
      ...Layout.alignItemsEnd,
    },
    header: {
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Fonts.textCenter,
      color: Colors.red,
      marginTop: 20,
      marginBottom: 20,
      textTransform: 'uppercase',
    },
    body: {
      ...Fonts.textSmall,
      ...Fonts.textCenter,
      marginBottom: 50,
      paddingHorizontal: 20,
    },
    buttonWrapper: {
      ...Layout.row,
      ...Layout.justifyContentAround,
    },
  })
}
