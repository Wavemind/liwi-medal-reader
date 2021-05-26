import { StyleSheet } from 'react-native'

export default function (props) {
  const { Fonts, Gutters, Layout, Colors } = props

  return StyleSheet.create({
    header: {
      backgroundColor: Colors.grey,
      ...Layout.fill,
      ...Layout.center,
    },
    textHeader: {
      color: Colors.secondary,
      ...Fonts.textRegular,
      ...Fonts.textUppercase,
    },
    textPatient: {
      color: Colors.secondary,
      ...Fonts.textRegular,
      ...Fonts.textBold,
    },
    textMonth: {
      color: Colors.secondary,
      ...Layout.smallLPadding,
      ...Fonts.textSmall,
      ...Gutters.regularHPadding,
    },
    itemWrapper: (open, status) => ({
      backgroundColor:
        status === 'notDone' ? Colors.lightGrey : Colors.secondary,
      ...(open ? Gutters.regularBPadding : null),
    }),
    stage: (open, status) => ({
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      ...Gutters.smallHPadding,
      ...Gutters.regularVPadding,
      backgroundColor:
        status === 'current'
          ? Colors.primary
          : status === 'notDone'
          ? Colors.lightGrey
          : Colors.secondary,
      borderColor: Colors.black,
      borderTopWidth: 1,
      borderBottomWidth: open ? 1 : 0,
    }),
    stageText: status => ({
      ...Fonts.textRegular,
      ...Fonts.textBold,
      ...Fonts.textUppercase,
      color:
        status === 'current'
          ? Colors.secondary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
    }),
    mainIcon: status => ({
      color:
        status === 'current'
          ? Colors.secondary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
    }),
    checkedIcon: status => ({
      color: status === 'done' ? Colors.primary : 'transparent',
    }),
    stepsWrapper: {
      ...Gutters.regularHPadding,
    },
    dotWrapper: {
      ...Gutters.smallHMargin,
      ...Layout.center,
    },
  })
}
