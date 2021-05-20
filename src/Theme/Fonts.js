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
    },
    textColorPrimary: {
      color: Colors.primary,
    },
    textColorSecondary: {
      color: Colors.secondary,
    },
    textSmall: {
      fontSize: FontSize.small,
    },
    textMedium: {
      fontSize: FontSize.medium,
    },
    textRegular: {
      fontSize: FontSize.regular,
    },
    textSectionHeader: {
      fontSize: FontSize.sectionHeader,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    textLarge: {
      fontSize: FontSize.large,
    },
    titleSmall: {
      fontSize: FontSize.small * 2,
      fontWeight: 'bold',
    },
    titleRegular: {
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
    },
    titleLarge: {
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
    },
    textBold: {
      fontWeight: 'bold',
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
