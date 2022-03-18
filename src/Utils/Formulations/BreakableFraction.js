import fractionUnicode from 'fraction-unicode'

import toReadableFraction from '@/Utils/Formulations/ToReadableFraction'

/**
 * Returns a string with the amount of breakable to give to the patient
 * @param drugDose - related drug information
 * @returns {string} - amount of breakable to give to the patient
 */
export const breakableFraction = drugDose => {
  const unit = drugDose.doseResult / drugDose.breakable
  const num = Math.floor(unit)
  let result = ''

  if (num > 0 && num !== Infinity) {
    result = num
  }
  if (drugDose.doseResult !== null) {
    const rest = drugDose.doseResult % drugDose.breakable

    if (rest !== 0) {
      const readableFraction = toReadableFraction(rest / drugDose.breakable)
      result += fractionUnicode(
        readableFraction.numerator,
        readableFraction.denominator,
      )
    }
  }
  return result
}
