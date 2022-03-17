import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations'
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
    case Config.MEDICATION_FORMS.patch: {
      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.unique_dose,
      )} ${i18n
        .t(`formulations.medication_form.${drugDose.medication_form}`)
        .toLowerCase()}`
    }
    case Config.MEDICATION_FORMS.inhaler: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(
          drugDose.unique_dose,
        )} ${i18n
          .t(`formulations.drug.${drugDose.medication_form}`)
          .toLowerCase()}`
      }
      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.unique_dose,
      )} ml ${i18n.t('formulations.drug.per_administration')}`
    }
    // Asked -> https://github.com/Wavemind/liwi-medal-reader/issues/450
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.dispersible_tablet:
    case Config.MEDICATION_FORMS.tablet:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.solution:
    case Config.MEDICATION_FORMS.powder_for_injection: {
      return translate(drugDose.description)
    }
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.drops: {
      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.unique_dose,
      )} ml ${i18n.t('formulations.drug.per_application')}`
    }
    // WAITING CLINICAL TEAM
    case Config.MEDICATION_FORMS.syrup:
    case Config.MEDICATION_FORMS.suspension: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${roundSup(
          drugDose.unique_dose,
        )}ml`
      }
      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.doseResult,
      )}ml ${i18n.t('formulations.drug.per_administration')}`
    }
    ////////////////////////////////////////////
    case Config.MEDICATION_FORMS.suppository: {
      return `${i18n.t('formulations.medication_form.suppository')} ${i18n.t(
        'formulations.drug.per_administration',
      )}: ${drugDose.doses_per_day}`
    }
    default: {
      return `(${drugDose.medication_form}) ${i18n.t(
        'formulations.drug.medication_form_not_handled',
      )}`
    }
  }
}
