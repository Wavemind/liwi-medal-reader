import { Animated } from 'react-native'

/**
 * Simulate fade in animation
 * @param {integer} fadeAnim - Value to update
 * @param {integer} duration - Time of animation
 */
export const fadeIn = (fadeAnim, duration = 1500) => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: duration,
    useNativeDriver: true,
  }).start()
}
