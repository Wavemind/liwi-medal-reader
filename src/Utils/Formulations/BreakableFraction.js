import toReadableFraction from '@/Utils/Formulations/ToReadableFraction'
import fractionUnicode from 'fraction-unicode'

/**
 * Returns a string with the amount of breakable to give to the patient
 * @param drugDose - related drug information
 * @returns {string} - amount of breakable to give to the patient
 */
export const breakableFraction = drugDose => {
  let result = ''
  if (drugDose.doseResult !== null) {
    const flooredDoseResult = Math.floor(drugDose.doseResult)

    // Avoid zero division
    if (flooredDoseResult > 0 && flooredDoseResult !== Infinity) {
      result = flooredDoseResult
    }

    const numberOfFullSolid = Math.floor(flooredDoseResult / drugDose.breakable)

    // Less than one solid
    if (numberOfFullSolid === 0) {
      const readableFraction = toReadableFraction(
        flooredDoseResult / drugDose.breakable,
      )

      const humanReadableFraction = fractionUnicode(
        readableFraction.numerator,
        readableFraction.denominator,
      )

      if (readableFraction.denominator === 1) {
        result = readableFraction.numerator
      } else {
        result = humanReadableFraction
      }
    } else {
      // More than one solid
      result = numberOfFullSolid

      const readableRestFraction = toReadableFraction(
        (flooredDoseResult - numberOfFullSolid * drugDose.breakable) /
          drugDose.breakable,
      )

      const humanReadableRestFraction = fractionUnicode(
        readableRestFraction.numerator,
        readableRestFraction.denominator,
      )

      result += humanReadableRestFraction
    }
  }
  return result
}
