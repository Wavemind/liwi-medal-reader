/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations'
import { Config } from '@/Config'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'

/**
 * Formulation display in mediation selection
 * @param drugDose
 * @returns {string}
 */
export const formulationLabel = drugDose => {
  if (drugDose.doseResult === null && !drugDose.uniqDose) {
    return `${translate(drugDose.description)}: ${i18n.t(
      'formulations.drug.no_options',
    )}`
  }

  switch (drugDose.medication_form) {
    case Config.MEDICATION_FORMS.syrup:
    case Config.MEDICATION_FORMS.suspension:
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.dispersible_tablet:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.solution:
    case Config.MEDICATION_FORMS.powder_for_injection: {
      return translate(drugDose.description)
    }
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.patch:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.drops: {
      return `${translate(drugDose.description)}: ${i18n.t(
        'formulations.drug.per_application',
        {
          count: parseInt(drugDose.unique_dose, 10),
        },
      )}`
    }
    case Config.MEDICATION_FORMS.suppository: {
      return `${translate(drugDose.description)}: ${i18n.t(
        'formulations.drug.per_administration',
        {
          count: parseInt(drugDose.unique_dose, 10),
        },
      )}`
    }
    case Config.MEDICATION_FORMS.tablet: {
      const fractionString = breakableFraction(drugDose)
      const fractionTranslated = i18n.t('formulations.medication_form.tablet', {
        count: parseInt(fractionString, 10),
        fraction: fractionString,
      })
      return `${translate(drugDose.description)}: ${fractionTranslated}`
    }
    case Config.MEDICATION_FORMS.inhaler: {
      return `${translate(drugDose.description)}: ${i18n.t(
        'formulations.drug.per_inhalation',
        {
          count: parseInt(drugDose.unique_dose, 10),
        },
      )}`
    }
    default: {
      return `(${drugDose.medication_form}) ${i18n.t(
        'formulations.drug.medication_form_not_handled',
      )}`
    }
  }
}
