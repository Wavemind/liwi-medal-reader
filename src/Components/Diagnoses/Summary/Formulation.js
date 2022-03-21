/**
 * The external imports
 */
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'

const Formulation = ({ drugDose }) => {
  const { t } = useTranslation()

  if (drugDose.doseResult === null && !drugDose.uniqDose) {
    return `${translate(drugDose.description)}: ${t(
      'formulations.drug.no_options',
    )}`
  }

  switch (drugDose.medication_form) {
    case Config.MEDICATION_FORMS.syrup:
    case Config.MEDICATION_FORMS.suspension:
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.dispersible_tablet:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.solution:
    case Config.MEDICATION_FORMS.tablet:
    case Config.MEDICATION_FORMS.powder_for_injection: {
      return translate(drugDose.description)
    }
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.patch: {
      return `${translate(drugDose.description)}: ${t(
        `formulations.medication_form.${drugDose.medication_form}`,
        {
          count: parseInt(drugDose.unique_dose, 10),
        },
      )}`
    }
    case Config.MEDICATION_FORMS.suppository:
    case Config.MEDICATION_FORMS.inhaler: {
      if (drugDose.by_age) {
        return `${translate(drugDose.description)}: ${t(
          `formulations.medication_form.${drugDose.medication_form}`,
          {
            count: parseInt(drugDose.unique_dose, 10),
          },
        )}`
      }
      return `${translate(drugDose.description)}: ${t(
        'formulations.drug.per_administration',
        {
          count: parseInt(drugDose.unique_dose, 10),
        },
      )}`
    }
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.drops: {
      return `${translate(drugDose.description)}: ${t(
        'formulations.drug.per_application',
        {
          count: parseInt(drugDose.unique_dose, 10),
        },
      )}`
    }
    default: {
      return `(${drugDose.medication_form}) ${t(
        'formulations.drug.medication_form_not_handled',
      )}`
    }
  }
}

export default Formulation
