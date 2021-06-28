/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton, ErrorNavBar } from '@/Components'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import InsertPatient from '@/Store/DatabasePatient/Insert'
import StepValidation from '@/Store/Validation/Step'
import UpdateFieldPatient from '@/Store/Patient/UpdateField'
import {
  SaveMedicalCaseService,
  CloseMedicalCaseService,
} from '@/Services/MedicalCase'
import { getStages } from '@/Utils/Navigation/GetStages'
import { GenerateUpdatePatient } from '@/Utils'
import InsertPatientValues from '@/Store/DatabasePatientValues/Insert'
import UpdatePatientValues from '@/Store/DatabasePatientValues/Update'
import UpdatePatient from '@/Store/DatabasePatient/Update'
import InsertMedicalCase from '@/Store/DatabaseMedicalCase/Insert'

const StageWrapperNavbar = ({ stageIndex, stepIndex }) => {
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
          const medicalCaseSaved = await SaveMedicalCaseService({ nextStage })

          if (medicalCaseSaved) {
            setLoading(false)
            navigation.navigate('StageWrapper', {
              stageIndex: nextStage,
              stepIndex: stageNavigation[nextStage].length - 1,
            })
          }
        }

        setLoading(false)
        navigation.navigate('StageWrapper', {
          stageIndex: nextStage,
          stepIndex: stageNavigation[nextStage].length - 1,
        })
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
    return <ErrorNavBar message={medicalCaseInsertError} />
  }

  if (medicalCaseUpdateError) {
    return <ErrorNavBar message={medicalCaseUpdateError} />
  }

  if (patientInsertError) {
    return <ErrorNavBar message={patientInsertError} />
  }

  if (patientUpdateError) {
    return <ErrorNavBar message={patientUpdateError} />
  }

  if (patientValuesInsertError) {
    return <ErrorNavBar message={patientValuesInsertError} />
  }

  if (patientValuesUpdateError) {
    return <ErrorNavBar message={patientValuesUpdateError} />
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
        ) : null}
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
                SaveMedicalCaseService({ nextStage: advancement.stage })
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
