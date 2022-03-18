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

const DoseIndication = ({ drugDose }) => {
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
    case Config.MEDICATION_FORMS.syrup:
    case Config.MEDICATION_FORMS.suspension:
    case Config.MEDICATION_FORMS.powder_for_injection:
    case Config.MEDICATION_FORMS.solution:
      if (drugDose.by_age) {
        return (
          <Text>
            {t('formulations.drug.fixe_dose_indication', {
              medicationForm: `${parseInt(drugDose.unique_dose, 10)}ml`,
            })}
          </Text>
        )
      } else {
        return (
          <Text>
            {t('formulations.drug.dose_indication', {
              dosage: drugDose.doseResultMg / mcWeight.value,
              patientWeight: mcWeight.value,
              total: drugDose.doseResultMg,
            })}
          </Text>
        )
      }
    case Config.MEDICATION_FORMS.suppository:
    case Config.MEDICATION_FORMS.capsule:
    case Config.MEDICATION_FORMS.tablet:
    case Config.MEDICATION_FORMS.dispersible_tablet:
      if (drugDose.by_age) {
        return (
          <Text>
            {t('formulations.drug.fixe_dose_indication', {
              medicationForm: t(
                `formulations.medication_form.${drugDose.medication_form}`,
                { count: parseInt(drugDose.unique_dose, 10) },
              ),
            })}
          </Text>
        )
      } else {
        const currentDosage = roundSup(
          (drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)) /
            mcWeight.value,
        )

        return (
          <Text>
            {t('formulations.drug.dose_indication', {
              dosage: currentDosage,
              patientWeight: mcWeight.value,
              total: currentDosage * mcWeight.value,
            })}
          </Text>
        )
      }
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
          {t('formulations.drug.fixe_dose_indication', {
            medicationForm: t(
              `formulations.medication_form.${drugDose.medication_form}`,
              { count: parseInt(drugDose.unique_dose, 10) },
            ),
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

export default DoseIndication
