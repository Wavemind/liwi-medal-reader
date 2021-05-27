import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, FontSize, Gutters, Fonts } = props

  const roundSize = hp(3.3)
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
      borderWidth: 3,
      ...Gutters.smallBMargin,
    }),
    separator: status => ({
      backgroundColor:
        status === 'current'
          ? Colors.secondary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
      width: wp(0.6),
      height: hp(1.1),
      ...Gutters.tinyVMargin,
    }),
    circleHitBox: {
      height: roundSize,
    },
    circleInner: status => ({
      width: roundSize - 12,
      height: roundSize - 12,
      borderRadius: (roundSize - 12) / 2,
      backgroundColor: status === 'current' ? Colors.secondary : Colors.primary,
      marginTop: 3,
      marginLeft: 3,
    }),
    barItem: status => ({
      backgroundColor: status === 'current' ? Colors.primary : Colors.secondary,
      display: 'flex',
      width: wp(9.1),
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
