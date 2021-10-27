import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { roundSup } from '@/Utils/Formulations/RoundSup'
import { Config } from '@/Config'

/**
 * Formulation display
 * @param drugDose
 * @returns {string}
 */
export const formulationLabel = drugDose => {
  switch (drugDose.medication_form) {
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.patch:
    case Config.MEDICATION_FORMS.inhaler: {
      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.unique_dose,
      )} ${i18n
        .t(`formulations.medication_form.${drugDose.medication_form}`)
        .toLowerCase()}`
    }
    case Config.MEDICATION_FORMS.tablet:
    case Config.MEDICATION_FORMS.dispersible_tablet: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(
          drugDose.unique_dose,
        )} ${i18n.t('formulations.drug.tablets')}`
      }
      return `${roundSup(drugDose.dose_form)}mg ${i18n
        .t(`formulations.medication_form.${drugDose.medication_form}`)
        .toLowerCase()}: ${
        drugDose.doseResult !== null
          ? `${breakableFraction(drugDose)} ${i18n.t(
              'formulations.drug.tablets',
            )}`
          : i18n.t('formulations.drug.no_options')
      }`
    }
    case Config.MEDICATION_FORMS.capsule: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(
          drugDose.unique_dose,
        )} ${i18n.t('formulations.drug.capsules')}`
      }
      return `${drugDose.doseResult} ${i18n.t('formulations.drug.capsules')}`
    }
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.solution:
    case Config.MEDICATION_FORMS.powder_for_injection:
    case Config.MEDICATION_FORMS.drops: {
      return `${translate(drugDose.description)}`
    }
    case Config.MEDICATION_FORMS.syrup:
    case Config.MEDICATION_FORMS.suspension: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(
          drugDose.unique_dose,
        )}ml`
      }
      return `${roundSup(drugDose.liquid_concentration)}mg/${roundSup(
        drugDose.dose_form,
      )}ml ${i18n
        .t(`formulations.medication_form.${drugDose.medication_form}`)
        .toLowerCase()}: ${roundSup(drugDose.doseResult)}ml ${i18n.t(
        'formulations.medication_form.per_administration',
      )}`
    }
    case Config.MEDICATION_FORMS.suppository: {
      return `${i18n.t('formulations.medication_form.suppository')} ${i18n.t(
        'formulations.medication_form.per_administration',
      )}: ${drugDose.doses_per_day}`
    }
    default: {
      return `(${drugDose.medication_form}) ${i18n.t(
        'formulations.drug.medication_form_not_handled',
      )}`
    }
  }
}
