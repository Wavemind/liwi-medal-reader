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
    case Config.MEDICATION_FORMS.syrup:
    case Config.MEDICATION_FORMS.suspension:
    case Config.MEDICATION_FORMS.powder_for_injection:
    case Config.MEDICATION_FORMS.solution:
      return (
        <Text>
          {t('formulations.drug.give')}: {roundSup(drugDose.doseResult)}
          {t('formulations.drug.ml')} {t('formulations.drug.of')}{' '}
          {roundSup(drugDose.liquid_concentration)}
          {t('formulations.drug.mg')}/{drugDose.dose_form}
          {t('formulations.drug.ml')}
        </Text>
      )

    case Config.MEDICATION_FORMS.tablet:
    case Config.MEDICATION_FORMS.dispersible_tablet:
      const fractionString = breakableFraction(drugDose)
      return (
        <Text>
          {t('formulations.drug.give')}{' '}
          {t(`formulations.medication_form.${drugDose.medication_form}`, {
            count: parseInt(fractionString, 10),
            fraction: fractionString,
          })}
        </Text>
      )
    case Config.MEDICATION_FORMS.suppository:
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.drops:
    case Config.MEDICATION_FORMS.patch:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.inhaler:
      return (
        <Text>
          {t('formulations.drug.give')}{' '}
          {t(`formulations.medication_form.${drugDose.medication_form}`, {
            count: parseInt(drugDose.unique_dose, 10),
          })}
        </Text>
      )
    default:
      return (
        <Text style={finalDiagnoses.noItemsText}>
          {t('formulations.drug.missing_medicine_formulation')}
        </Text>
      )
  }
}

export default AmountGiven
