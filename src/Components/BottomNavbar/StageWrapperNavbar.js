/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text, Keyboard } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import NavigationConfig from '@/Config/Navigation'
import { SquareButton, ErrorNavbar } from '@/Components'
import { navigateAndSimpleReset, navigateToStage } from '@/Navigators/Root'
import InsertPatient from '@/Store/DatabasePatient/Insert'
import StepValidation from '@/Store/Validation/Step'
import UpdateFieldPatient from '@/Store/Patient/UpdateField'
import UpdateFieldMedicalCase from '@/Store/MedicalCase/UpdateField'

import {
  SaveMedicalCaseService,
  CloseMedicalCaseService,
} from '@/Services/MedicalCase'
import { getStages } from '@/Utils/Navigation/GetStages'
import { GenerateUpdatePatient } from '@/Utils'
import UpdatePatient from '@/Store/DatabasePatient/Update'
import InsertPatientValues from '@/Store/DatabasePatientValues/Insert'
import UpdatePatientValues from '@/Store/DatabasePatientValues/Update'
import InsertMedicalCase from '@/Store/DatabaseMedicalCase/Insert'
import ResetAssessments from '@/Store/MedicalCase/ArmControl/ResetAssessments'
import UnlockMedicalCase from '@/Store/DatabaseMedicalCase/Unlock'

const StageWrapperNavbar = ({ stageIndex }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
    Colors,
    FontSize,
    Gutters,
  } = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigation = useNavigation()

  const [loading, setLoading] = useState(false)

  const stageNavigation = getStages()
  const isConnected = useSelector(state => state.network.isConnected)
  const architecture = useSelector(
    state => state.healthFacility.item.architecture,
  )
  const advancement = useSelector(state => state.medicalCase.item.advancement)
  const patient = useSelector(state => state.patient.item)
  const isArmControl = useSelector(state => state.algorithm.item.is_arm_control)
  const medicalCaseId = useSelector(state => state.medicalCase.item.id)
  const stepIndex = useSelector(
    state => state.medicalCase.item.advancement.step,
  )
  const patientSavedInDatabase = useSelector(
    state => state.patient.item.savedInDatabase,
  )
  const medicalCaseSavedInDatabase = useSelector(
    state => state.medicalCase.item.savedInDatabase,
  )
  const patientInsertError = useSelector(
    state => state.databasePatient.insert.error,
  )
  const patientUpdateError = useSelector(
    state => state.databasePatient.update.error,
  )
  const medicalCaseUpdateError = useSelector(
    state => state.databaseMedicalCase.update.error,
  )
  const medicalCaseInsertError = useSelector(
    state => state.databaseMedicalCase.insert.error,
  )
  const patientValuesInsertError = useSelector(
    state => state.databasePatientValues.insert.error,
  )
  const patientValuesUpdateError = useSelector(
    state => state.databasePatientValues.update.error,
  )
  const errors = useSelector(state => state.validation.item)

  /**
   * Re dispatches the step verification process
   * @returns {Promise<void>}
   */
  const revalidateStep = async () => {
    setLoading(true)
    await Keyboard.dismiss()
    await new Promise(resolve => setTimeout(resolve, 200))
    await dispatch(StepValidation.action())
    setLoading(false)
  }

  /**
   * Pre check of validation and insert in database patient if we're at registration stage
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   * @param {boolean} skipValidation : tells the method to skip the validation process
   */
  const stepVerification = async (direction, skipValidation = false) => {
    setLoading(true)
    await Keyboard.dismiss()
    await new Promise(resolve => setTimeout(resolve, 200))
    let validation = null
    if (!skipValidation) {
      validation = await dispatch(StepValidation.action())
    }

    // Continue only if validation pass and there is no errors
    if (
      skipValidation ||
      (isFulfilled(validation) &&
        Object.values(validation.payload).length === 0)
    ) {
      // New patient or patient already exist but not in fale safe mode
      if (
        advancement.stage === 0 &&
        (!patientSavedInDatabase ||
          (!isConnected && architecture === 'client_server'))
      ) {
        const patientInsert = await dispatch(InsertPatient.action())

        if (isFulfilled(patientInsert)) {
          dispatch(
            UpdateFieldPatient.action({
              field: 'savedInDatabase',
              value: !patientSavedInDatabase,
            }),
          )
          dispatch(
            UpdateFieldMedicalCase.action({
              field: 'savedInDatabase',
              value: !medicalCaseSavedInDatabase,
            }),
          )
          const insertPatientValues = await dispatch(
            InsertPatientValues.action(),
          )
          if (isFulfilled(insertPatientValues)) {
            await handleNavigation(direction)
          }
        }
      } else if (advancement.stage === 0 && patientSavedInDatabase) {
        const patientUpdate = await dispatch(
          UpdatePatient.action(GenerateUpdatePatient(patient)),
        )

        if (isFulfilled(patientUpdate)) {
          const updatePatientValues = await dispatch(
            UpdatePatientValues.action(),
          )
          if (isFulfilled(updatePatientValues)) {
            if (!medicalCaseSavedInDatabase) {
              const medicalCaseInsert = await dispatch(
                InsertMedicalCase.action(),
              )
              if (isFulfilled(medicalCaseInsert)) {
                await dispatch(
                  UpdateFieldMedicalCase.action({
                    field: 'savedInDatabase',
                    value: !medicalCaseSavedInDatabase,
                  }),
                )
                await handleNavigation(direction)
              }
            } else {
              await handleNavigation(direction)
            }
          }
        }
      } else {
        await handleNavigation(direction)
      }
    }

    setLoading(false)
  }

  /**
   * Dispatches the action that resets all the Assessments + refreshed the view
   */
  const handleResetAssessments = async () => {
    await dispatch(ResetAssessments.action())
    navigateToStage(
      NavigationConfig.ARM_CONTROL_ASSESSMENT_STAGE,
      stageNavigation[NavigationConfig.ARM_CONTROL_ASSESSMENT_STAGE].steps
        .length - 1,
    )
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
          await dispatch(UnlockMedicalCase.action({ medicalCaseId }))
          navigateAndSimpleReset('Home', {
            destroyCurrentConsultation: true,
          })
        }
      }
    }
  }

  /**
   * Will navigate to the next step / Stage base on the current navigation State
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const handleNavigation = async direction => {
    const nextStep = advancement.step + direction
    const steps = stageNavigation[stageIndex].steps

    if (nextStep < steps.length && nextStep >= 0) {
      setLoading(false)
      navigation.navigate(steps[nextStep].label)
    } else {
      const nextStage = Number(stageIndex) + direction

      // Test if nextStage exist. If not, save and close medical case
      if (stageNavigation[nextStage] !== undefined) {
        // Not save if we go back
        if (direction !== -1) {
          const medicalCaseSaved = await SaveMedicalCaseService({
            stageIndex: nextStage,
            stepIndex: 0,
          })

          if (medicalCaseSaved) {
            setLoading(false)
            navigation.navigate('StageWrapper', {
              stageIndex: nextStage,
              stepIndex: 0,
            })
          }
        } else {
          setLoading(false)
          navigateToStage(
            nextStage,
            stageNavigation[nextStage].steps.length - 1,
          )
        }
      } else {
        const medicalCaseClosed = await CloseMedicalCaseService({ nextStage })

        if (medicalCaseClosed) {
          setLoading(false)
          navigateAndSimpleReset('Home', { destroyCurrentConsultation: true })
        }
      }
    }
  }

  if (medicalCaseInsertError) {
    return (
      <ErrorNavbar
        loading={loading}
        onPress={revalidateStep}
        errors={medicalCaseInsertError}
      />
    )
  }

  if (medicalCaseUpdateError) {
    return (
      <ErrorNavbar
        loading={loading}
        onPress={revalidateStep}
        errors={medicalCaseUpdateError}
      />
    )
  }

  if (patientInsertError) {
    return (
      <ErrorNavbar
        loading={loading}
        onPress={revalidateStep}
        errors={patientInsertError}
      />
    )
  }

  if (patientUpdateError) {
    return (
      <ErrorNavbar
        loading={loading}
        onPress={revalidateStep}
        errors={patientUpdateError}
      />
    )
  }

  if (patientValuesInsertError) {
    return (
      <ErrorNavbar
        loading={loading}
        onPress={revalidateStep}
        errors={patientValuesInsertError}
      />
    )
  }

  if (patientValuesUpdateError) {
    return (
      <ErrorNavbar
        loading={loading}
        onPress={revalidateStep}
        errors={patientValuesUpdateError}
      />
    )
  }

  if (Object.keys(errors).length > 0) {
    return (
      <View style={bottomNavbar.errorContainer}>
        <View style={[Layout.fill, Layout.row]}>
          <View style={[Layout.fill, Layout.center]}>
            <Text style={bottomNavbar.errorText}>
              {Object.values(errors)[0]}
            </Text>
          </View>
        </View>
        <View style={bottomNavbar.errorButtonWrapper}>
          <View style={[Layout.fill, Gutters.regularRMargin]}>
            <Text style={bottomNavbar.errorNumber}>
              {Object.values(errors).length}
            </Text>
          </View>
          <View style={bottomNavbar.errorNextButton}>
            <SquareButton
              filled
              icon="right-arrow"
              iconAfter
              bgColor={Colors.offWhite}
              color={Colors.black}
              iconSize={FontSize.large}
              disabled={loading}
              onPress={revalidateStep}
            />
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={bottomNavbar.stageWrapperContainer}>
      <View style={[Layout.fill, Layout.row]}>
        {stageIndex > 0 ? (
          <View style={bottomNavbar.actionButton}>
            <SquareButton
              label={t('containers.medical_case.navigation.back')}
              filled
              bgColor={Colors.whiteToLightBlack}
              color={Colors.primary}
              icon="left-arrow"
              align={Layout.alignItemsStart}
              iconSize={FontSize.regular}
              onPress={() => stepVerification(-1, true)}
            />
          </View>
        ) : null}
        {isArmControl &&
          stageIndex === NavigationConfig.ARM_CONTROL_ASSESSMENT_STAGE && (
            <View style={bottomNavbar.actionButton}>
              <SquareButton
                label={t('actions.reset')}
                filled
                bgColor={Colors.grey}
                icon="refresh"
                iconSize={FontSize.large}
                onPress={handleResetAssessments}
              />
            </View>
          )}
      </View>
      <View style={[Layout.fill, Layout.row]}>
        {advancement.stage > 0 && (
          <View style={bottomNavbar.actionButton}>
            <SquareButton
              label={t('actions.save')}
              filled
              bgColor={Colors.grey}
              icon="save-quit"
              iconSize={FontSize.large}
              color={Colors.white}
              onLongPress={exitAndSave}
              onPress={() =>
                SaveMedicalCaseService({
                  stageIndex: advancement.stage,
                  stepIndex: advancement.step,
                })
              }
            />
          </View>
        )}

        <View style={bottomNavbar.actionButton}>
          <SquareButton
            label={t('containers.medical_case.navigation.next')}
            filled
            icon="right-arrow"
            iconAfter
            disabled={loading}
            iconSize={FontSize.regular}
            onPress={() => stepVerification(1)}
          />
        </View>
      </View>
    </View>
  )
}

export default StageWrapperNavbar
