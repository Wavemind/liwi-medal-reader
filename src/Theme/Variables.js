import { hp } from '@/Theme/Responsive'
/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  // Colors that change in dark mode
  primary: '#121212',
  secondary: '#ececec',
  background: '#f2f1ee',
  whiteToBlack: '#ffffff',

  // CONSTANTS
  black: '#000000',
  lightBlack: '#121212',
  white: '#ffffff',
  offWhite: '#ececec',
  red: '#d20730',
  warning: '#e27900',

  // WHITES
  whiteToLightPink: '#ffffff',
  whiteToLightGrey: '#ffffff',

  // LIGHT GREYS
  lightGrey: '#f2f1ee',
  lightGreyToAnotherLightGrey: '#f2f1ee',
  lightGreyToDarkGrey: '#f2f1ee',

  // DARK GREYS
  darkGreyToLightGrey: '#121212',

  // DARK LIGHT GREYS
  darkLightGrey: '#afafaf',

  // ORANGES

  // SOME OTHER LIGHT GREYS
  disabled: '#d3d1cf',
  grey: '#6f6f6f',
  abitDarkerLightGrey: '#6f6f6f',
  abitLighterDarkLightGrey: '#686868',
  darkerLightGreyToBlack: '#e1e1e1',

  // SOME OTHER DARK GREYS
  darkerDarkGrey: '#0e1511',
  lighterDarkGrey: '#afafaf',
  middleDarkGreyToLightGrey: '#3c3c3c',
  middleDarkGreyToAnotherLightGrey: '#3c3c3c',
  darkGrey: '#323232',

  // Colors that don't change in dark mode
  primaryLowOpacity: '#00000088',
  softRed: '#fbdedb',
  redLowOpacity: '#d2073044',
  transparent: 'rgba(0,0,0,0)',
}

export const NavigationColors = {
  primary: Colors.primary,
}

/**
 * FontSize
 */
export const FontSize = {
  drawer: hp(1.4),
  tiny: hp(1.5),
  small: hp(1.7),
  medium: hp(1.9),
  regular: hp(2.2),
  sectionHeader: hp(2.6),
  large: hp(3.5),
  big: hp(4.6),
  huge: hp(6.6),
}

/**
 * Metrics Sizes
 */
const tiny = hp(0.6)
const small = tiny * 2
const regular = tiny * 3
const large = regular * 3
const huge = large * 2
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
  huge,
}
