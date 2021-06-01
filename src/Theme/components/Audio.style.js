import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Gutters, Layout } = props

  return StyleSheet.create({
    time: {
      ...Layout.selfCenter,
    },

    pauseButton: {
      ...Gutters.smallBMargin,
    },

    audioInnerContainer: {
      ...Layout.row,
      ...Layout.rowHCenter,
      ...Gutters.regularVMargin,
      ...Gutters.regularHMargin,
      position: 'relative',
    },

    audioContainer: {
      ...Layout.fill,
      ...Layout.justifyContentCenter,
      ...Gutters.regularLMargin,
      ...Gutters.smallRMargin,
      ...Gutters.alignItemsStretch,
    },

    thumb: {
      backgroundColor: Colors.red,
    },

    track: {
      backgroundColor: Colors.grey,
    },
  })
}
