import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, Fonts, Gutters } = props

  return StyleSheet.create({
    focused: {
      borderBottomColor: Colors.primary,
      borderBottomWidth: 5,
      ...Gutters.smallHMargin,
    },
    text: status => ({
      color: status === 'toDo' ? Colors.grey : Colors.primary,
      ...Fonts.textTiny,
      fontFamily: status === 'current' ? 'ZeitungPro-Bold' : 'ZeitungPro',
      borderBottomColor:
        status === 'current' ? Colors.primary : Colors.secondary,
      borderBottomWidth: 5,
      ...Layout.fill,
      ...Fonts.textCenter,
      ...Gutters.smallHMargin,
      ...Gutters.smallVPadding,
    }),
    tab: {
      ...Layout.row,
      ...Layout.center,
      ...Layout.scrollSpaceBetween,
    },
    wrapper: {
      minWidth: '100%',
      backgroundColor: Colors.secondary,
      ...Layout.row,
      ...Layout.center,
    },
    itemWrapper: {
      ...Layout.fill,
    },
  })
}
