import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, FontSize, Gutters, Fonts } = props

  const roundSize = hp(3.3)
  return StyleSheet.create({
    circle: (status, thinLines) => ({
      width: roundSize,
      height: roundSize,
      borderRadius: roundSize / 2,
      backgroundColor:
        status === 'current' && !thinLines
          ? Colors.primary
          : Colors.whiteToSecondary,
      borderColor:
        status === 'notDone'
          ? Colors.grey
          : status === 'current' && !thinLines
          ? Colors.secondary
          : Colors.primary,
      borderWidth: 2,
      ...Gutters.smallBMargin,
    }),
    separator: (status, thinLines) => ({
      backgroundColor:
        status === 'current'
          ? Colors.primary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
      height: thinLines ? hp(2.2) : hp(1.1),
      width: thinLines ? wp(0.3) : wp(0.6),
      ...(thinLines ? null : Gutters.tinyVMargin),
    }),
    circleHitBox: {
      height: roundSize,
    },
    circleInner: (status, thinLines) => ({
      width: roundSize - 12,
      height: roundSize - 12,
      borderRadius: (roundSize - 12) / 2,
      backgroundColor:
        status === 'current' && !thinLines ? Colors.secondary : Colors.primary,
      marginTop: 4,
      marginLeft: 4,
    }),
    barItem: status => ({
      backgroundColor: status === 'current' ? Colors.primary : Colors.whiteToLightBlack,
      display: 'flex',
      width: wp(9.1),
      ...Gutters.smallVPadding,
      ...Gutters.regularBPadding,
      ...Layout.center,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: Colors.border,
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
      ...Fonts.textUppercase,
      ...Fonts.textCenter,
      ...Fonts.textBold,
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
