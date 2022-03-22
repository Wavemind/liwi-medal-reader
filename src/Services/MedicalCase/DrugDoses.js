import { store } from '@/Store'
import { Config } from '@/Config'
import { roundSup } from '@/Utils/Formulations/RoundSup'

/**
 * Set the right dose calculation for a drug.
 * @param formulationIndex
 * @param drugId
 * @returns {
 * { doseResult: null}
 * | {recurrence: *, doseResult: *, doseResultMg: *, maxDoseMg: *, minDoseMl: number, maxDoseMl: number, minDoseMg: *}
 * | {recurrence: *, doseResult: *, maxDoseCap: number, maxDoseMg: *, minDoseMg: *, minDoseCap: number}
 * }
 */
const drugDoses = (formulationIndex, drugId) => {
  const algorithm = store.getState().algorithm.item
  const medicalCase = store.getState().medicalCase.item
  const mcWeight =
    medicalCase.nodes[algorithm.config.basic_questions.weight_question_id]

  let minDoseMg
  let maxDoseMg
  let doseResult
  let doseResultMg
  let pillSize
  let uniqDose = false

  const drug = algorithm.nodes[drugId]

  // Select formulation
  const formulation = drug.formulations[formulationIndex]

  if (formulation === undefined) {
    return { doseResult: null, uniqDose }
  }

  const recurrence = 24 / formulation.doses_per_day

  if (!formulation.by_age) {
    switch (formulation.medication_form) {
      case Config.MEDICATION_FORMS.syrup:
      case Config.MEDICATION_FORMS.suspension:
      case Config.MEDICATION_FORMS.powder_for_injection:
      case Config.MEDICATION_FORMS.ointment:
      case Config.MEDICATION_FORMS.solution:
        minDoseMg = roundSup(
          (mcWeight.value * formulation.minimal_dose_per_kg) /
            formulation.doses_per_day,
        )
        maxDoseMg = roundSup(
          (mcWeight.value * formulation.maximal_dose_per_kg) /
            formulation.doses_per_day,
        )

        // Second calculate min and max dose (cap)
        const minDoseMl =
          (minDoseMg * formulation.dose_form) / formulation.liquid_concentration
        const maxDoseMl =
          (maxDoseMg * formulation.dose_form) / formulation.liquid_concentration

        // Round
        doseResult = (minDoseMl + maxDoseMl) / 2

        if (doseResult > maxDoseMl) {
          doseResult -= 1
        }

        doseResultMg =
          (doseResult * formulation.liquid_concentration) /
          formulation.dose_form

        // If we reach the limit / day
        if (
          doseResultMg * formulation.doses_per_day >
          formulation.maximal_dose
        ) {
          doseResultMg = formulation.maximal_dose / formulation.doses_per_day
          doseResult =
            (doseResultMg * formulation.dose_form) /
            formulation.liquid_concentration
        }

        return {
          minDoseMg,
          maxDoseMg,
          minDoseMl,
          maxDoseMl,
          doseResult,
          doseResultMg,
          recurrence,
          uniqDose,
          ...formulation,
        }

      case Config.MEDICATION_FORMS.capsule:
      case Config.MEDICATION_FORMS.dispersible_tablet:
      case Config.MEDICATION_FORMS.tablet:
        // First calculate min and max dose (mg/Kg)
        minDoseMg = roundSup(
          (mcWeight.value * formulation.minimal_dose_per_kg) /
            formulation.doses_per_day,
        )

        maxDoseMg = roundSup(
          (mcWeight.value * formulation.maximal_dose_per_kg) /
            formulation.doses_per_day,
        )

        pillSize = formulation.dose_form
        if (formulation.breakable !== null) {
          pillSize /= formulation.breakable
        }
        console.log('AVANT', pillSize, minDoseMg)
        // Second calculate min and max dose (cap)
        const minDoseCap = roundSup((1 / pillSize) * minDoseMg)
        const maxDoseCap = roundSup((1 / pillSize) * maxDoseMg)

        // Define Dose Result
        doseResult = (minDoseCap + maxDoseCap) / 2

        if (maxDoseCap < 1) {
          return {
            ...formulation,
            uniqDose,
            doseResult: null,
          }
        }

        if (doseResult <= maxDoseCap) {
          // Viable Solution
          doseResult = doseResult
        } else if (doseResult >= minDoseCap) {
          // Other viable solution
          doseResult = doseResult
        } else {
          // Out of possibility
          // Request on 09.02.2021 if no option available we give the min dose cap LIWI-1150
          doseResult = minDoseCap
        }

        return {
          minDoseMg,
          maxDoseMg,
          minDoseCap,
          maxDoseCap,
          doseResult,
          recurrence,
          uniqDose,
          ...formulation,
        }
      default:
        return { doseResult: null, uniqDose: true, recurrence, ...formulation }
    }
  }

  return { doseResult: null, uniqDose: true, recurrence, ...formulation }
}

export default drugDoses
