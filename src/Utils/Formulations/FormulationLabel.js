import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { roundSup } from '@/Utils/Formulations/RoundSup'
import { medicationForms } from '@/Utils/Formulations/Constants'

/**
 * Formulation display
 * @param drugDose
 * @returns {string}
 */
export const formulationLabel = drugDose => {
  switch (drugDose.medication_form) {
    case medicationForms.pessary:
    case medicationForms.spray:
    case medicationForms.patch:
    case medicationForms.inhaler: {
      return `${translate(drugDose.description)}: ${roundSup(drugDose.unique_dose)} ${i18n.t(`formulations.medication_form.${drugDose.medication_form}`).toLowerCase()}`
    }
    case medicationForms.tablet:
    case medicationForms.dispersible_tablet: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(drugDose.unique_dose)} ${i18n.t('formulations.drug.tablets')}`
      }
      return `${roundSup(drugDose.dose_form)}mg ${i18n.t(`formulations.medication_form.${drugDose.medication_form}`).toLowerCase()}: ${drugDose.doseResult !== null
          ? `${breakableFraction(drugDose)} ${i18n.t('formulations.drug.tablets')}`
          : i18n.t('formulations.drug.no_options')
      }`
    }
    case medicationForms.capsule: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(
          drugDose.unique_dose,
        )} ${i18n.t('formulations.drug.capsules')}`
      }
      return `${drugDose.doseResult} ${i18n.t('formulations.drug.capsules')}`
    }
    case medicationForms.cream:
    case medicationForms.ointment:
    case medicationForms.gel:
    case medicationForms.drops: {
      return `${translate(drugDose.description)}`
    }
    case medicationForms.syrup:
    case medicationForms.suspension:
    case medicationForms.powder_for_injection:
    case medicationForms.solution: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(
          drugDose.unique_dose,
        )}ml`
      }
      return `${roundSup(drugDose.liquid_concentration)}mg/${roundSup(drugDose.dose_form)}ml ${i18n
        .t(`formulations.medication_form.${drugDose.medication_form}`)
        .toLowerCase()}: ${drugDose.doseResult}ml ${i18n.t('formulations.medication_form.per_administration')}`
    }
    default: {
      return `(${drugDose.medication_form}) ${i18n.t(
        'formulations.drug.medication_form_not_handled',
      )}`
    }
  }
}
