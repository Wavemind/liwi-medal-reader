import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters } = props

  return StyleSheet.create({
    wrapper: {
      ...Gutters.regularHMargin,
      ...Gutters.regularTMargin,
    },
  })
}
