import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, FontSize, Layout, Fonts, Gutters } = props

  return StyleSheet.create({
    focused: {
      borderBottomColor: Colors.primary,
      borderBottomWidth: 5,
      ...Gutters.smallHMargin,
    },
    text: status => ({
      color: status === 'toDo' ? Colors.grey : Colors.primary,
      marginHorizontal: 10,
      fontSize: FontSize.tiny,
      fontWeight: status === 'current' ? 'bold' : 'normal',
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
  })
}
