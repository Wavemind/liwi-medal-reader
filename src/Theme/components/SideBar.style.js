import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, FontSize, Gutters } = props

  const roundSize = 30
  return StyleSheet.create({
    circle: status => ({
      width: roundSize,
      height: roundSize,
      borderRadius: roundSize / 2,
      backgroundColor: status === 'current' ? Colors.black : Colors.white,
      borderColor:
        status === 'notDone'
          ? Colors.grey
          : status === 'current'
          ? Colors.white
          : Colors.black,
      borderWidth: 3,
      marginBottom: 10,
    }),
    separator: status => ({
      backgroundColor:
        status === 'current'
          ? Colors.white
          : status === 'notDone'
          ? Colors.grey
          : Colors.black,
      width: 4,
      height: 10,
      ...Gutters.tinyVMargin,
    }),
    circleHitBox: {
      height: roundSize,
    },
    circleInner: status => ({
      width: roundSize - 12,
      height: roundSize - 12,
      borderRadius: (roundSize - 12) / 2,
      backgroundColor: status === 'current' ? Colors.white : Colors.black,
      marginTop: 3,
      marginLeft: 3,
    }),
    barItem: status => ({
      backgroundColor: status === 'current' ? Colors.black : Colors.white,
      display: 'flex',
      alignItems: 'center',
      width: 55,
      ...Gutters.smallVPadding,
    }),
    text: status => ({
      textTransform: 'uppercase',
      overflow: 'visible',
      fontSize: FontSize.regular,
      fontWeight: 'bold',
      color:
        status === 'current'
          ? Colors.white
          : status === 'notDone'
          ? Colors.grey
          : Colors.black,
      textAlign: 'center',
      padding: 0,
      marginTop: -10,
      transform: [{ rotateZ: '90deg' }],
    }),
    rotatedTextWrapper: {
      paddingTop: 17,
      paddingBottom: 12,
      marginBottom: 7,
    },
    container: { display: 'flex', alignItems: 'center' },
    wrapper: {
      ...Layout.fullWidth,
      flexBasis: 55,
      backgroundColor: Colors.white,
      flexDirection: 'row',
    },
  })
}
