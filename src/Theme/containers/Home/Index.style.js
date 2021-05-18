import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Gutters } = props

  return StyleSheet.create({
    buttonsWrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularTMargin,
    },
    buttonListWrapper: {
      ...Layout.row,
      ...Gutters.regularTMargin,
    },
    buttonList: {
      ...Layout.fill,
      ...Layout.column,
      ...Gutters.smallRMargin,
    },
  })
}
