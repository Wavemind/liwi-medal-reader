/**
 * The external imports
 */
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { translate } from '@/Translations/algorithm'
import { roundSup } from '@/Utils/Formulations/RoundSup'

const Formulation = ({ drugDose }) => {
  const { t } = useTranslation()

  if (drugDose.doseResult === null && !drugDose.uniqDose) {
    return `${translate(drugDose.description)}: ${t(
      'formulations.drug.no_options',
    )}`
  }

  switch (drugDose.medication_form) {
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.drops:
    case Config.MEDICATION_FORMS.patch:
    case Config.MEDICATION_FORMS.suppository:
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.powder_for_injection: {
      return translate(drugDose.description)
    }
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.dispersible_tablet:
    case Config.MEDICATION_FORMS.tablet: {
      if (drugDose.uniqDose) {
        return translate(drugDose.description)
      }

      const { fractionString, numberOfFullSolid } = breakableFraction(drugDose)

      // Needed to add context due to english translation not handle 0 as singular
      const fractionTranslated = t('formulations.medication_form.tablet', {
        count: numberOfFullSolid,
        fraction: fractionString,
        context: String(numberOfFullSolid),
      })
      return `${translate(drugDose.description)}: ${fractionTranslated}`
    }
    case Config.MEDICATION_FORMS.solution:
    case Config.MEDICATION_FORMS.suspension: {
      if (drugDose.uniqDose) {
        return `${translate(drugDose.description)}: ${t(
          'formulations.drug.per_administration',
          {
            count: parseFloat(drugDose.unique_dose),
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
    case Config.MEDICATION_FORMS.syrup: {
      if (drugDose.uniqDose) {
        return translate(drugDose.description)
      }
      return `${translate(drugDose.description)}: ${roundSup(
        drugDose.doseResult,
      )}ml`
    }
    case Config.MEDICATION_FORMS.inhaler: {
      return `${translate(drugDose.description)}: ${t(
        'formulations.drug.per_administration',
        {
          suffix: t(
            `formulations.medication_form.${drugDose.medication_form}`,
            {
              count: parseFloat(drugDose.unique_dose),
            },
          ),
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
