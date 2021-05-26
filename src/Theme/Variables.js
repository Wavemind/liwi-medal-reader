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
  // Example colors:
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  black: '#000000',
  red: '#d20730',
  buttonGrey: '#303030',
  grey: '#6f6f6f',
  lightGrey: '#f2f1ee',
  text: '#212529',
  primary: '#000000',
  secondary: '#ffffff',
  success: '#28a745',
  error: '#dc3545',
}

export const NavigationColors = {
  primary: Colors.primary,
}

/**
 * FontSize
 */
export const FontSize = {
  small: 16,
  medium: 17,
  regular: 20,
  sectionHeader: 24,
  large: 40,
  huge: 60,
}

/**
 * Metrics Sizes
 */
const tiny = 5 // 10
const small = tiny * 2 // 10
const regular = tiny * 3 // 15
const large = regular * 3 // 45
const huge = large * 2 // 90
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
  huge,
}
