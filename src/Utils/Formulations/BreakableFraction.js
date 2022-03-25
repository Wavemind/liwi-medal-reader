/**
 * The external imports
 */
import fractionUnicode from 'fraction-unicode'

/**
 * The internal imports
 */
import toReadableFraction from '@/Utils/Formulations/ToReadableFraction'
import { Config } from '@/Config'

/**
 * Returns a string with the amount of breakable to give to the patient
 * @param drugDose - related drug information
 * @returns {string} - amount of breakable to give to the patient
 */
export const breakableFraction = drugDose => {
  let result = ''
  if (drugDose.doseResult !== null) {
    // Avoid everything for capsule
    if (drugDose.medication_form === Config.MEDICATION_FORMS.capsule) {
      return drugDose.doseResult
    }
    const flooredDoseResult = Math.floor(drugDose.doseResult)
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
