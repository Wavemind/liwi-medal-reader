import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters } = props

  return StyleSheet.create({
    buttonWrapper: {
      ...Gutters.regularVMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      backgroundColor: '#FFF',
    },
  })
}
