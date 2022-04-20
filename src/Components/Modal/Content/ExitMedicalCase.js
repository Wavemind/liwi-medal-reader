/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import UnlockMedicalCase from '@/Store/DatabaseMedicalCase/Unlock'
import { SquareButton } from '@/Components'
import { useTheme } from '@/Theme'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { SaveMedicalCaseService } from '@/Services/MedicalCase'
import { GenerateUpdatePatient } from '@/Utils'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'
import ChangeClinician from '@/Store/HealthFacility/ChangeClinician'
import UpdatePatient from '@/Store/DatabasePatient/Update'
import UpdatePatientValues from '@/Store/DatabasePatientValues/Update'

const ExitMedicalCase = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const patientSavedInDatabase = useSelector(
    state => state.patient.item.savedInDatabase,
  )

  const routeName = useSelector(state => state.modal.params.routeName)
  const routeParams = useSelector(state => state.modal.params.routeParams)
  const stageIndex = useSelector(
    state => state.medicalCase.item.advancement.stage,
  )
  const stepIndex = useSelector(
    state => state.medicalCase.item.advancement.step,
  )
  const patient = useSelector(state => state.patient.item)
  const medicalCaseId = useSelector(state => state.medicalCase.item.id)

  /**
   * Redirect user to home page and clear medical case store
   */
  const exitWithoutSave = async () => {
    if (routeName === 'Auth') {
      await dispatch(ChangeClinician.action({ clinician: {} }))
    }

    await dispatch(UnlockMedicalCase.action({ medicalCaseId }))
    await dispatch(ToggleVisibility.action({}))

    navigateAndSimpleReset(routeName, {
      ...routeParams,
      destroyCurrentConsultation: true,
    })
  }

  /**
   * Save in database current medical case and redirect user to home page and clear medical case store
   */
  const exitAndSave = async () => {
    const patientUpdate = await dispatch(
      UpdatePatient.action(GenerateUpdatePatient(patient)),
    )

    if (isFulfilled(patientUpdate)) {
      const updatePatientValues = await dispatch(UpdatePatientValues.action())
      if (isFulfilled(updatePatientValues)) {
        const medicalCaseSaved = await SaveMedicalCaseService({
          stageIndex,
          stepIndex,
        })
        if (medicalCaseSaved) {
          if (routeName === 'Auth') {
            await dispatch(ChangeClinician.action({ clinician: {} }))
          }
          await dispatch(UnlockMedicalCase.action({ medicalCaseId }))
          await dispatch(ToggleVisibility.action({}))

          navigateAndSimpleReset(routeName, {
            ...routeParams,
            destroyCurrentConsultation: true,
          })
        }
      }
    }
  }

  return (
    <View>
      <Text style={modal.header}>
        {t('components.modals.exit_medical_case.title')}
      </Text>
      <Text style={modal.body}>
        {t('components.modals.exit_medical_case.content')}
      </Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label={t('components.modals.exit_medical_case.exit_and_save')}
          filled
          disabled={
            !patientSavedInDatabase || (stageIndex === 0 && stepIndex === 0)
          }
          onPress={exitAndSave}
          bgColor={Colors.grey}
          color={Colors.white}
          fullWidth={false}
        />
        <SquareButton
          label={t('components.modals.exit_medical_case.exit_without_save')}
          filled
          onPress={exitWithoutSave}
          bgColor={Colors.primary}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default ExitMedicalCase
