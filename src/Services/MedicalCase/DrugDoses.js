import { store } from '@/Store'
import i18n from '@/Translations'
import { Config } from '@/Config'
import { roundSup } from '@/Utils/Formulations/RoundSup'

/**
 * Set the right dose calculation for a drug.
 * @param formulationIndex
 * @param drugId
 * @returns {
 * { doseResult: null}
 * | {doseResult: null, no_possibility: string}
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

  const drug = algorithm.nodes[drugId]

  // Select formulation
  const formulation = drug.formulations[formulationIndex]

  if (formulation === undefined) {
    return { doseResult: null }
  }

  const recurrence = 24 / formulation.doses_per_day

  // Age and weight must be answered to calculate dosage
  if (
    mcWeight !== undefined &&
    mcWeight.value !== null &&
    !formulation.by_age
  ) {
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
        pillSize = formulation.dose_form // dose form

        if (formulation.breakable !== null) {
          pillSize /= formulation.breakable
        }

        // Second calculate min and max dose (cap)
        const minDoseCap = roundSup((1 / pillSize) * minDoseMg)
        const maxDoseCap = roundSup((1 / pillSize) * maxDoseMg)
        // Define Dose Result
        doseResult = (minDoseCap + maxDoseCap) / 2
        if (maxDoseCap < 1) {
          return {
            ...formulation,
            no_possibility: i18n.t('formulations.drug.no_options'),
            doseResult: null,
          }
        }
        if (Math.ceil(doseResult) <= maxDoseCap) {
          // Viable Solution
          doseResult = Math.ceil(doseResult)
        } else if (Math.floor(doseResult) >= minDoseCap) {
          // Other viable solution
          doseResult = Math.floor(doseResult)
        } else {
          // Out of possibility
          // Request on 09.02.2021 if no option available we give the min dose cap LIWI-1150
          doseResult = Math.floor(minDoseCap)
        }
        return {
          minDoseMg,
          maxDoseMg,
          minDoseCap,
          maxDoseCap,
          doseResult,
          recurrence,
          ...formulation,
        }
      default:
        break
    }
  }
  return { doseResult: null, recurrence, ...formulation }
}

export default drugDoses
