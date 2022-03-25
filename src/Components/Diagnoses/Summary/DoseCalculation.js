/**
 * The external imports
 */
import React from 'react'
import { Text } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { roundSup } from '@/Utils/Formulations/RoundSup'
import { Config } from '@/Config'
import { useTheme } from '@/Theme'

const DoseCalculation = ({ drugDose }) => {
  const { t } = useTranslation()
  const {
    Containers: { finalDiagnoses },
  } = useTheme()

  const weightQuestionId = useSelector(
    state => state.algorithm.item.config.basic_questions.weight_question_id,
  )
  const mcWeight = useSelector(
    state => state.medicalCase.item.nodes[weightQuestionId],
  )

  switch (drugDose.medication_form) {
    case Config.MEDICATION_FORMS.solution:
    case Config.MEDICATION_FORMS.suspension:
    case Config.MEDICATION_FORMS.syrup:
    case Config.MEDICATION_FORMS.powder_for_injection:
      if (drugDose.uniqDose) {
        return t('formulations.drug.fixed_dose_indication_administration', {
          medicationForm: `${parseInt(drugDose.unique_dose, 10)}ml`,
        })
      }
      return t('formulations.drug.dose_indication', {
        dosage: drugDose.doseResultMg / mcWeight.value,
        patientWeight: mcWeight.value,
        total: drugDose.doseResultMg,
      })
    case Config.MEDICATION_FORMS.gel:
    case Config.MEDICATION_FORMS.ointment:
    case Config.MEDICATION_FORMS.cream:
    case Config.MEDICATION_FORMS.lotion:
    case Config.MEDICATION_FORMS.patch:
      return t('formulations.drug.fixed_dose_indication_application', {
        count: parseInt(drugDose.unique_dose, 10),
      })
    case Config.MEDICATION_FORMS.drops:
    case Config.MEDICATION_FORMS.spray:
    case Config.MEDICATION_FORMS.suppository:
    case Config.MEDICATION_FORMS.pessary:
    case Config.MEDICATION_FORMS.inhaler:
      return t('formulations.drug.fixed_dose_indication_administration', {
        medicationForm: t(
          `formulations.medication_form.${drugDose.medication_form}`,
          { count: parseInt(drugDose.unique_dose, 10) },
        ),
      })
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.tablet:
    case Config.MEDICATION_FORMS.dispersible_tablet:
      if (drugDose.uniqDose) {
        return t('formulations.drug.fixed_dose_indication_administration', {
          medicationForm: t(
            `formulations.medication_form.${drugDose.medication_form}`,
            {
              count: parseInt(drugDose.unique_dose, 10),
              fraction: parseInt(drugDose.unique_dose, 10),
            },
          ),
        })
      }

      let currentDosage = ''

      if (drugDose.medication_form === Config.MEDICATION_FORMS.capsule) {
        currentDosage = roundSup(
          (drugDose.doseResult * drugDose.dose_form) / mcWeight.value,
        )
      } else {
        currentDosage = roundSup(
          (drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)) /
            mcWeight.value,
        )
      }

      return t('formulations.drug.dose_indication', {
        dosage: currentDosage,
        patientWeight: mcWeight.value,
        total: currentDosage * mcWeight.value,
      })
    default:
      return (
        <Text style={finalDiagnoses.noItemsText}>
          {t('formulations.drug.missing_medicine_formulation')}
        </Text>
      )
  }
}

export default DoseCalculation
