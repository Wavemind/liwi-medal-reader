import { heightPercentageToDP } from 'react-native-responsive-screen'
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
  primary: '#1f1f1f',
  secondary: '#ffffff',
  red: '#d20730',
  grey: '#6f6f6f',
  warning: '#e27900',
  lightGrey: '#f2f1ee',
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
  tiny: Math.round(heightPercentageToDP(1.5)),
  small: Math.round(heightPercentageToDP(1.7)),
  medium: Math.round(heightPercentageToDP(1.8)),
  regular: Math.round(heightPercentageToDP(2.2)),
  sectionHeader: Math.round(heightPercentageToDP(2.6)),
  large: Math.round(heightPercentageToDP(3.5)),
  huge: Math.round(heightPercentageToDP(6.6)),
}

/**
 * Metrics Sizes
 */
const tiny = Math.round(heightPercentageToDP(0.6))
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
