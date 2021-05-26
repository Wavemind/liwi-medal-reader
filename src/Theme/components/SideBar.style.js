import { StyleSheet } from 'react-native'

export default function (props) {
  const { Colors, Layout, FontSize, Gutters, Fonts } = props

  const roundSize = 30
  return StyleSheet.create({
    circle: status => ({
      width: roundSize,
      height: roundSize,
      borderRadius: roundSize / 2,
      backgroundColor: status === 'current' ? Colors.primary : Colors.secondary,
      borderColor:
        status === 'notDone'
          ? Colors.grey
          : status === 'current'
          ? Colors.secondary
          : Colors.primary,
      borderWidth: 2,
      ...Gutters.smallBMargin,
    }),
    separator: (status, thinLines) => ({
      backgroundColor:
        status === 'current'
          ? Colors.secondary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
      width: thinLines ? 2 : 4,
      height: thinLines ? 20 : 1,
      ...(thinLines ? null : Gutters.tinyVMargin),
    }),
    circleHitBox: {
      height: roundSize,
    },
    circleInner: status => ({
      width: roundSize - 12,
      height: roundSize - 12,
      borderRadius: (roundSize - 12) / 2,
      backgroundColor: status === 'current' ? Colors.secondary : Colors.primary,
      marginTop: 4,
      marginLeft: 4,
    }),
    barItem: status => ({
      backgroundColor: status === 'current' ? Colors.primary : Colors.secondary,
      display: 'flex',
      width: 55,
      ...Gutters.smallVPadding,
      ...Layout.center,
    }),
    text: status => ({
      overflow: 'visible',
      fontSize: FontSize.regular,
      color:
        status === 'current'
          ? Colors.secondary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
      padding: 0,
      marginTop: -10,
      transform: [{ rotateZ: '90deg' }],
      ...Fonts.textBold,
      ...Fonts.textUppercase,
      ...Fonts.textCenter,
    }),
    rotatedTextWrapper: {
      ...Gutters.regularTPadding,
      ...Gutters.tinyBPadding,
      ...Gutters.smallBMargin,
    },
    container: { display: 'flex', alignItems: 'center' },
    wrapper: {
      flexBasis: 55,
      backgroundColor: Colors.secondary,
      ...Layout.fullWidth,
      ...Layout.center,
    },
  })
}
