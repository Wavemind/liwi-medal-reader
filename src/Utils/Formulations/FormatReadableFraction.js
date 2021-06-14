/**
 * Formats the readable fraction object as a string.
 *
 * @param {Object} fractionObject - The fraction object to convert to a string.
 *   It's recommended to use the result of toReadableFraction, but any
 *   array with the format of [numerator, denominator] is allowed.
 * @param {Boolean} isImproper (optional) - If true, will return an improper
 *   fraction if the fraction object has a numerator greater than its
 *   denominator.
 * @returns {String} The fraction object in string format.
 */

export default function formatReadableFraction(
  fractionObject,
  isImproper = false,
) {
  const { denominator, numerator } = fractionObject

  // When the numerator is 0, return an empty string instead of
  // '0/denominator'.
  if (numerator === 0) {
    return ''
  }

  // If the fraction is improper or the numerator is less than the denominator
  // then we can do the easy thing and return numerator/denominator.
  if (isImproper || numerator < denominator) {
    return `${numerator}/${denominator}`
  }

  // Grab the whole number.
  const wholeNumber = Math.floor(numerator / denominator)
  // Grab the remainder which will be the numerator in the remainder fraction.
  const remainder = numerator % denominator
  // Same concept as above, don't show the remainder if the numerator is 0.
  const isRemainderShown = remainder !== 0

  return `${wholeNumber}${
    isRemainderShown ? ` ${remainder}/${denominator}` : ''
  }`
}
