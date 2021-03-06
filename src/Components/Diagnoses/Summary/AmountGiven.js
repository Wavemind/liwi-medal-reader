/**
 * The external imports
 */
import React from 'react'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { roundSup } from '@/Utils/Formulations/RoundSup'
import { Config } from '@/Config'
import { useTheme } from '@/Theme'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'

const AmountGiven = ({ drugDose }) => {
  const { t } = useTranslation()
  const {
    Containers: { finalDiagnoses },
  } = useTheme()

  switch (drugDose.medication_form) {
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.patch:
      return t('formulations.drug.amount_given_per_application', {
        count: parseFloat(drugDose.unique_dose),
      })
    case Config.MEDICATION_FORMS.suppository:
    case Config.MEDICATION_FORMS.drops:
      return t('formulations.drug.amount_give', {
        medicationForm: t(
          `formulations.medication_form.${drugDose.medication_form}`,
          {
            count: parseFloat(drugDose.unique_dose),
          },
        ),
      })
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.inhaler:
      return t('formulations.drug.amount_given_medication_form', {
        medicationForm: t(
          `formulations.medication_form.${drugDose.medication_form}`,
          {
            count: parseFloat(drugDose.unique_dose),
          },
        ),
      })
    case Config.MEDICATION_FORMS.suspension:
    case Config.MEDICATION_FORMS.powder_for_injection:
    case Config.MEDICATION_FORMS.solution:
      if (drugDose.uniqDose) {
        return t('formulations.drug.amount_give', {
          medicationForm: `${parseFloat(drugDose.unique_dose)}ml`,
        })
      }

      if (
        ['im', 'iv', 'sc'].includes(
          drugDose.administration_route_name.toLowerCase(),
        )
      ) {
        return t('formulations.drug.amount_given_im_iv_sc', {
          doseResult: roundSup(drugDose.doseResult),
          liquidConcentration: roundSup(drugDose.liquid_concentration),
          doseForm: parseFloat(drugDose.dose_form),
          medicationForm: t(
            `formulations.medication_form.${drugDose.medication_form}`,
          ),
        })
      }

      return t('formulations.drug.amount_give', {
        medicationForm: `${roundSup(drugDose.doseResult)}ml`,
      })
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.tablet:
    case Config.MEDICATION_FORMS.dispersible_tablet:
      if (drugDose.uniqDose) {
        return t('formulations.drug.amount_give', {
          medicationForm: t(
            `formulations.medication_form.${drugDose.medication_form}`,
            {
              count: parseFloat(drugDose.unique_dose),
              fraction: parseFloat(drugDose.unique_dose),
            },
          ),
        })
      }
      const { fractionString, numberOfFullSolid } = breakableFraction(drugDose)

      // Needed to add context due to english translation not handle 0 as singular
      return t('formulations.drug.amount_give', {
        medicationForm: t(
          `formulations.medication_form.${drugDose.medication_form}`,
          {
            count: numberOfFullSolid,
            fraction: fractionString,
            context: String(numberOfFullSolid),
          },
        ),
      })
    case Config.MEDICATION_FORMS.syrup:
      if (drugDose.uniqDose) {
        return t('formulations.drug.amount_give', {
          medicationForm: `${parseFloat(drugDose.unique_dose)}ml`,
        })
      }

      return t('formulations.drug.amount_give', {
        medicationForm: `${roundSup(drugDose.doseResult)}ml`,
      })

    default:
      return (
        <Text style={finalDiagnoses.noItemsText}>
          {t('formulations.drug.missing_medicine_formulation')}
        </Text>
      )
  }
}

export default AmountGiven
