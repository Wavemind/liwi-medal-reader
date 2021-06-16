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
  primary: '#000000',
  primaryLowOpacity: '#00000088',
  secondary: '#ffffff',
  red: '#d20730',
  softRed: '#fbdedb',
  redLowOpacity: '#d2073044',
  grey: '#6f6f6f',
  disabled: '#d3d1cf',
  warning: '#e27900',
  lightGrey: '#f2f1ee',
  transparent: 'rgba(0,0,0,0)',
  text: '#121212',
  white: '#ffffff',
  darkGrey: '#323232',
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
