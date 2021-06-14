import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { medicationForms, roundSup } from '@/Utils/Formulations/DrugDoses'

/**
 * Formulation display
 * @param calculatedFormulation
 * @returns {string}
 */
export const formulationLabel = calculatedFormulation => {
  switch (calculatedFormulation.medication_form) {
    case medicationForms.pessary:
    case medicationForms.spray:
    case medicationForms.patch:
    case medicationForms.inhaler: {
      return `${translate(calculatedFormulation.description)}: ${roundSup(
        calculatedFormulation.unique_dose,
      )} ${i18n
        .t(`medication_form:${calculatedFormulation.medication_form}`)
        .toLowerCase()}`
    }
    case medicationForms.tablet:
    case medicationForms.dispersible_tablet: {
      if (calculatedFormulation.by_age) {
        return `${translate(calculatedFormulation.description)}: ${roundSup(
          calculatedFormulation.unique_dose,
        )} ${i18n.t('drug:tablets')}`
      }
      return `${roundSup(calculatedFormulation.dose_form)}mg ${i18n
        .t(`medication_form:${calculatedFormulation.medication_form}`)
        .toLowerCase()}: ${
        calculatedFormulation.doseResult !== null
          ? `${breakableFraction(calculatedFormulation)} ${i18n.t(
              'drug:tablets',
            )}`
          : i18n.t('drug:no_options')
      }`
    }
    case medicationForms.capsule: {
      if (calculatedFormulation.by_age) {
        return `${translate(calculatedFormulation.description)}: ${roundSup(
          calculatedFormulation.unique_dose,
        )} ${i18n.t('drug:capsules')}`
      }
      return `${calculatedFormulation.doseResult} ${i18n.t('drug:capsules')}`
    }
    case medicationForms.cream:
    case medicationForms.ointment:
    case medicationForms.gel:
    case medicationForms.drops: {
      return `${translate(calculatedFormulation.description)}`
    }
    case medicationForms.syrup:
    case medicationForms.suspension:
    case medicationForms.powder_for_injection:
    case medicationForms.solution: {
      if (calculatedFormulation.by_age) {
        return `${translate(calculatedFormulation.description)}: ${roundSup(
          calculatedFormulation.unique_dose,
        )}ml`
      }
      return `${roundSup(
        calculatedFormulation.liquid_concentration,
      )}mg/${roundSup(calculatedFormulation.dose_form)}ml ${i18n
        .t(`medication_form:${calculatedFormulation.medication_form}`)
        .toLowerCase()}: ${calculatedFormulation.doseResult}ml ${i18n.t(
        'medication_form:per_administration',
      )}`
    }
    default: {
      return `(${calculatedFormulation.medication_form}) ${i18n.t(
        'drug:medication_form_not_handled',
      )}`
    }
  }
}
