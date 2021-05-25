import { StyleSheet } from 'react-native'
import { Color } from '../../../../../.cache/typescript/4.2/node_modules/chalk/index'

export default function (props) {
  const { Colors, Layout, FontSize } = props
  return StyleSheet.create({
    circle: status => ({
      width: 35,
      height: 35,
      borderRadius: 35 / 2,
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
    circleInner: status => ({
      width: 23,
      height: 23,
      borderRadius: 23 / 2,
      backgroundColor: status === 'current' ? Colors.white : Colors.black,
      marginTop: 3,
      marginLeft: 3,
    }),
    barItemCurrent: {
      backgroundColor: Colors.black,
      color: Colors.white,
      display: 'flex',
      alignItems: 'center',
      width: 60,
    },
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
      flexBasis: 60,
      backgroundColor: Colors.white,
      flexDirection: 'row',
    },
  })
}
