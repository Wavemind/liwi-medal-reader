import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen'

/**
 * Calculate height DP based on screen size and given percent
 * @param {integer} height in percent
 * @returns
 */
export const hp = height => {
  return Math.round(heightPercentageToDP(height))
}

/**
 * Calculate width DP based on screen size and given percent
 * @param {integer} height in percent
 * @returns
 */
export const wp = width => {
  return Math.round(widthPercentageToDP(width))
}
