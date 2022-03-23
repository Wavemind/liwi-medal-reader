/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations'
import { Config } from '@/Config'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { roundSup } from '@/Utils/Formulations/RoundSup'

/**
 * Formulation display in mediation selection
 * @param drugDose
 * @returns {string}
 */
export const formulationLabel = drugDose => {
  // Early return if there is no options available
  if (drugDose.doseResult === null && !drugDose.uniqDose) {
    return `${translate(drugDose.description)}: ${i18n.t(
      'formulations.drug.no_options',
    )}`
  }

  // Normal behavior
  switch (drugDose.medication_form) {
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.drops:
    case Config.MEDICATION_FORMS.patch: {
      return `${translate(drugDose.description)}: ${i18n.t(
        'formulations.drug.per_application',
        {
          count: parseInt(drugDose.unique_dose, 10),
        },
      )}`
    }
    case Config.MEDICATION_FORMS.suppository:
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.inhaler: {
      return `${translate(drugDose.description)}: ${i18n.t(
        'formulations.drug.per_administration',
        {
          suffix: i18n.t(
            `formulations.medication_form.${drugDose.medication_form}`,
            {
              count: parseInt(drugDose.unique_dose, 10),
            },
          ),
        },
      )}`
    }
    case Config.MEDICATION_FORMS.solution:
    case Config.MEDICATION_FORMS.suspension: {
      if (drugDose.uniqDose) {
        return `${translate(drugDose.description)}: ${i18n.t(
          'formulations.drug.per_administration',
          {
            count: parseInt(drugDose.unique_dose, 10),
            suffix: 'ml',
          },
        )}`
      }

      if (
        ['im', 'iv', 'sc'].includes(
          drugDose.administration_route_name.toLowerCase(),
        )
      ) {
        return translate(drugDose.description)
      }

      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.doseResult,
      )}ml`
    }
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.dispersible_tablet:
    case Config.MEDICATION_FORMS.tablet: {
      if (drugDose.uniqDose) {
        return `${translate(drugDose.description)}: ${i18n.t(
          'formulations.drug.per_administration',
          {
            count: parseInt(drugDose.unique_dose, 10),
          },
        )}`
      }
      const fractionString = breakableFraction(drugDose)
      const fractionTranslated = i18n.t('formulations.medication_form.tablet', {
        count: parseInt(fractionString, 10),
        fraction: fractionString,
      })
      return `${translate(drugDose.description)}: ${fractionTranslated}`
    }
    case Config.MEDICATION_FORMS.powder_for_injection: {
      return translate(drugDose.description)
    }
    case Config.MEDICATION_FORMS.syrup:
      if (drugDose.uniqDose) {
        return `${translate(drugDose.description)}: ${i18n.t(
          'formulations.drug.per_administration',
          {
            count: parseInt(drugDose.unique_dose, 10),
            suffix: 'ml',
          },
        )}`
      }
      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.doseResult,
      )}ml`
    default: {
      return `(${drugDose.medication_form}) ${i18n.t(
        'formulations.drug.medication_form_not_handled',
      )}`
    }
  }
}
