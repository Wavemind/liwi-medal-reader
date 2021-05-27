/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ FontSize, Colors }) {
  return StyleSheet.create({
    textColorText: {
      color: Colors.text,
      fontFamily: 'ZeitungPro',
    },
    textColorPrimary: {
      color: Colors.primary,
      fontFamily: 'ZeitungPro',
    },
    textColorSecondary: {
      color: Colors.secondary,
      fontFamily: 'ZeitungPro',
    },
    textDrawer: {
      fontSize: FontSize.drawer,
      fontFamily: 'ZeitungPro',
      textTransform: 'uppercase',
    },
    textTiny: {
      fontSize: FontSize.tiny,
      fontFamily: 'ZeitungPro',
    },
    textSmall: {
      fontSize: FontSize.small,
      fontFamily: 'ZeitungPro',
    },
    textMedium: {
      fontSize: FontSize.medium,
      fontFamily: 'ZeitungPro',
    },
    textRegular: {
      fontSize: FontSize.regular,
      fontFamily: 'ZeitungPro',
    },
    textSectionHeader: {
      fontSize: FontSize.sectionHeader,
      fontFamily: 'ZeitungPro-Bold',
      textTransform: 'uppercase',
    },
    textLarge: {
      fontSize: FontSize.large,
      fontFamily: 'ZeitungPro',
    },
    titleSmall: {
      fontSize: FontSize.small,
      fontFamily: 'ZeitungPro-Bold',
    },
    titleRegular: {
      fontSize: FontSize.regular,
      fontFamily: 'ZeitungPro-Bold',
    },
    titleLarge: {
      fontSize: FontSize.large,
      fontFamily: 'ZeitungPro-Bold',
    },
    textBold: {
      fontFamily: 'ZeitungPro-Bold',
    },
    textItalic: {
      fontStyle: 'italic',
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
  })
}
