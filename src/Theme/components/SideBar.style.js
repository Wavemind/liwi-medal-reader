import { StyleSheet } from 'react-native'
import { hp, wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Layout, FontSize, Gutters, Fonts } = props

  const roundSize = hp(3.3)
  return StyleSheet.create({
    circle: (status, thinLines) => {
      let calculatedColor = ''
      if (status === 'notDone') {
        calculatedColor = Colors.grey
      } else {
        if (status === 'current' && !thinLines) {
          calculatedColor = Colors.secondary
        } else {
          calculatedColor = Colors.primary
        }
      }

      return {
        width: roundSize,
        height: roundSize,
        borderRadius: roundSize / 2,
        backgroundColor:
          status === 'current' && !thinLines
            ? Colors.primary
            : Colors.whiteToSecondary,
        borderColor: calculatedColor,
        borderWidth: 2,
        ...Gutters.smallBMargin,
      }
    },
    separator: (status, thinLines) => {
      let calculatedColor = ''
      if (status === 'current') {
        calculatedColor = Colors.primary
      } else {
        if (status === 'notDone') {
          calculatedColor = Colors.grey
        } else {
          calculatedColor = Colors.primary
        }
      }

      return {
        backgroundColor: calculatedColor,
        height: thinLines ? hp(2.2) : hp(1.1),
        width: thinLines ? wp(0.3) : wp(0.6),
        ...(thinLines ? null : Gutters.tinyVMargin),
      }
    },
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
      backgroundColor:
        status === 'current' ? Colors.primary : Colors.whiteToLightBlack,
      display: 'flex',
      width: wp(9.1),
      ...Gutters.smallVPadding,
      ...Gutters.regularBPadding,
      ...Layout.center,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: Colors.border,
    }),
    text: status => {
      let calculatedColor = ''
      if (status === 'current') {
        calculatedColor = Colors.secondary
      } else {
        if (status === 'notDone') {
          calculatedColor = Colors.grey
        } else {
          calculatedColor = Colors.primary
        }
      }

      return {
        overflow: 'visible',
        fontSize: FontSize.regular,
        color: calculatedColor,
        padding: 0,
        marginTop: -10,
        transform: [{ rotateZ: '90deg' }],
        ...Fonts.textUppercase,
        ...Fonts.textCenter,
        ...Fonts.textBold,
      }
    },
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
