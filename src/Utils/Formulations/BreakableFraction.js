import toReadableFraction from '@/Utils/Formulations/ToReadableFraction'

/**
 * Returns a string with the amount of breakable to give to the patient
 * @param drugDose - related drug informations
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
      const r = toReadableFraction(rest / drugDose.breakable)
      if (r.numerator === 1 && r.denominator === 2) {
        result += ' ½'
      } else if (r.numerator === 1 && r.denominator === 4) {
        result += ' ¼'
      } else if (r.numerator === 3 && r.denominator === 4) {
        result += ' ¾'
      } else {
        // other fraction
        result = `${result} ${r.numerator} / ${r.denominator}`
      }
    }
  }
  return result
}
