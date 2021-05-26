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
  backgroundColor: '#f2f1ee',
  primary: '#1f1f1f',
  secondary: '#ffffff',
  red: '#d20730',
  grey: '#6f6f6f',
  transparent: 'rgba(0,0,0,0)',
  text: '#121212',
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
