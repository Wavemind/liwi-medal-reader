import { StyleSheet } from 'react-native'

export default function (props) {
  const { Gutters, Colors } = props

  return StyleSheet.create({
    buttonWrapper: {
      ...Gutters.smallVMargin,
      ...Gutters.regularVPadding,
      ...Gutters.regularHPadding,
      backgroundColor: Colors.secondary,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.grey,
    },
  })
}
