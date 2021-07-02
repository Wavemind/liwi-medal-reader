/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, BackHandler } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { ARM_CONTROL_ASSESSMENT_STAGE } from '@/Config/Navigation'
import { SquareButton, ErrorNavbar } from '@/Components'
import { navigateAndSimpleReset } from '@/Navigators/Root'
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
import { navigateToStage } from '@/Navigators/Root'
import InsertPatientValues from '@/Store/DatabasePatientValues/Insert'
import UpdatePatientValues from '@/Store/DatabasePatientValues/Update'
import UpdatePatient from '@/Store/DatabasePatient/Update'
import InsertMedicalCase from '@/Store/DatabaseMedicalCase/Insert'
import ResetAssessments from '@/Store/MedicalCase/ArmControl/ResetAssessments'
import SetParams from '@/Store/Modal/SetParams'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'

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
  const advancement = useSelector(state => state.medicalCase.item.advancement)
  const patient = useSelector(state => state.patient.item)
  const isArmControl = useSelector(state => state.algorithm.item.is_arm_control)

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

  // Adds an event listener to tablet back button press
  // Opens the existMedicalCase modal and redirects to the Home screen
  useEffect(() => {
    const backAction = async () => {
      await dispatch(
        SetParams.action({
          type: 'exitMedicalCase',
          params: { routeName: 'Home', routeParams: {} },
        }),
      )
      await dispatch(ToggleVisibility.action({}))
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [])

  /**
   * Pre check of validation and insert in database patient if we're at registration stage
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const stepVerification = async (direction, skipValidation = false) => {
    setLoading(true)
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
      if (advancement.stage === 0 && !patientSavedInDatabase) {
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
      ARM_CONTROL_ASSESSMENT_STAGE,
      stageNavigation[ARM_CONTROL_ASSESSMENT_STAGE].steps.length - 1,
    )
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
      const nextStage = stageIndex + direction

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
    return <ErrorNavbar message={medicalCaseInsertError} />
  }

  if (medicalCaseUpdateError) {
    return <ErrorNavbar message={medicalCaseUpdateError} />
  }

  if (patientInsertError) {
    return <ErrorNavbar message={patientInsertError} />
  }

  if (patientUpdateError) {
    return <ErrorNavbar message={patientUpdateError} />
  }

  if (patientValuesInsertError) {
    return <ErrorNavbar message={patientValuesInsertError} />
  }

  if (patientValuesUpdateError) {
    return <ErrorNavbar message={patientValuesUpdateError} />
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
              bgColor={Colors.secondary}
              color={Colors.primary}
              iconSize={FontSize.large}
              disabled={loading}
              onPress={() => dispatch(StepValidation.action())}
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
              bgColor={Colors.secondary}
              color={Colors.primary}
              icon="left-arrow"
              align={Layout.alignItemsStart}
              iconSize={FontSize.regular}
              onPress={() => stepVerification(-1, true)}
            />
          </View>
        ) : null}
        {isArmControl && stageIndex === ARM_CONTROL_ASSESSMENT_STAGE && (
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
            iconSize={FontSize.regular}
            onPress={() => stepVerification(1)}
          />
        </View>
      </View>
    </View>
  )
}

export default StageWrapperNavbar
