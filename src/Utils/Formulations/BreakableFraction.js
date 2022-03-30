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
  let readableFraction = ''
  let humanReadableFraction = ''
  let numberOfFullSolid = 0

  if (drugDose.doseResult !== null) {
    // Avoid everything for capsule
    if (drugDose.medication_form === Config.MEDICATION_FORMS.capsule) {
      return drugDose.doseResult
    }
    numberOfFullSolid = Math.floor(drugDose.doseResult / drugDose.breakable)

    // Less than one solid
    if (numberOfFullSolid === 0) {
      readableFraction = toReadableFraction(
        drugDose.doseResult / drugDose.breakable,
      )
    } else {
      result = numberOfFullSolid

      // More than one solid
      readableFraction = toReadableFraction(
        (drugDose.doseResult - numberOfFullSolid * drugDose.breakable) /
          drugDose.breakable,
      )
    }

    // Generate human readable fraction
    humanReadableFraction = fractionUnicode(
      readableFraction.numerator,
      readableFraction.denominator,
    )

    if (readableFraction.denominator === 1) {
      result += readableFraction.numerator
    } else {
      result += humanReadableFraction
    }
  }
  return { fractionString: result, numberOfFullSolid }
}
