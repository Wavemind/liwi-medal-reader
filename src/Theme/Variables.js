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
  mcDrawerNotDone: '#f2f1ee',
  emergency: '#fbdedb',

  // CONSTANTS
  black: '#121212',
  white: '#ffffff',
  offWhite: '#ececec',
  red: '#d20730',
  warning: '#e27900',
  grey: '#6f6f6f',
  darkGrey: '#323232',
  disabled: '#d3d1cf',
  lightGrey: '#f2f1ee',
  border: '#9f9f9f',
  separator: '#e1e1e1',
  info: '#686868',
  redLowOpacity: '#d2073044',
  transparent: 'rgba(0,0,0,0)',
  primaryLowOpacity: '#00000088',
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
