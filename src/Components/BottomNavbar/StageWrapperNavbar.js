/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'
import InsertPatient from '@/Store/DatabasePatient/Insert'
import StepValidation from '@/Store/Validation/Step'
import UpdateFieldPatient from '@/Store/Patient/UpdateField'
import UpdateDatabaseMedicalCase from '@/Store/DatabaseMedicalCase/Update'
import InsertDatabaseActivity from '@/Store/DatabaseActivity/Insert'
import ClearActivitiesMedicalCase from '@/Store/MedicalCase/ClearActivities'
import useDatabase from '@/Services/Database/useDatabase'

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
  const navigationState = useNavigationState(
    state => state.routes[state.index].state,
  )

  const advancement = useSelector(state => state.medicalCase.item.advancement)
  const medicalCaseId = useSelector(state => state.medicalCase.item.id)
  const medicalCase = useSelector(state => state.medicalCase.item)
  const activities = useSelector(state => state.medicalCase.item.activities)

  const savedInDatabase = useSelector(
    state => state.patient.item.savedInDatabase,
  )
  const patientInsertError = useSelector(
    state => state.databasePatient.insert.error,
  )
  const medicalCaseUpdateError = useSelector(
    state => state.databaseMedicalCase.update.error,
  )
  const patientInsertLoading = useSelector(
    state => state.databasePatient.insert.loading,
  )

  const errors = useSelector(state => state.validation.item)

  /**
   * Pre check of validation and insert in database patient if we're at registration stage
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const stepVerification = async (direction, skipValidation = false) => {
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
      if (advancement.stage === 0 && !savedInDatabase) {
        const patientInsert = await dispatch(InsertPatient.action())

        if (isFulfilled(patientInsert)) {
          dispatch(
            UpdateFieldPatient.action({
              field: 'savedInDatabase',
              value: !savedInDatabase,
            }),
          )
          handleNavigation(direction)
        }
      } else {
        handleNavigation(direction)
      }
    }
  }

  /**
   * Will navigate to the next step / Stage base on the current navigation State
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const handleNavigation = async direction => {
    const medicalCaseState = navigationState.routes[navigationState.index].state
    const nextStep = advancement.step + direction


// TODO
// SAVE
// CLOSE MEDICAL CASE
// CLEAR CODE
// FIX NAVIGATION
// POP-IN lorsqu'on quit un cas médicale
// 

    if (
      medicalCaseState !== undefined &&
      nextStep < medicalCaseState.routes.length &&
      nextStep >= 0
    ) {
      navigation.navigate(medicalCaseState.routes[nextStep].name)
    } else {
      const nextStage = stageIndex + direction

      // Update medical case
      const medicalCaseUpdateAdvancement = await dispatch(
        UpdateDatabaseMedicalCase.action({
          medicalCaseId,
          fields: [
            { name: 'stage', value: nextStage },
            { name: 'step', value: 0 },
            {
              name: 'json',
              value: JSON.stringify({
                comment: medicalCase.comment,
                consent: medicalCase.consent,
                diagnosis: medicalCase.diagnosis,
                nodes: medicalCase.nodes,
              }),
            },
          ],
        }),
      )

      if (isFulfilled(medicalCaseUpdateAdvancement)) {
        // Add activities
        const addActivity = await dispatch(
          InsertDatabaseActivity.action({
            medicalCaseId,
            activities,
          }),
        )

        if (isFulfilled(addActivity)) {
          // Remove sended activities
          await dispatch(ClearActivitiesMedicalCase.action())

          // Redirect to next stage
          navigation.navigate('StageWrapper', {
            stageIndex: nextStage,
          })
        }
      }
    }
  }
  console.log('Je render')
  if (medicalCaseUpdateError) {
    return (
      <View style={bottomNavbar.errorContainer}>
        <View style={[Layout.fill, Layout.row]}>
          <Text style={bottomNavbar.errorText}>{medicalCaseUpdateError}</Text>
        </View>
      </View>
    )
  }

  if (patientInsertError) {
    return (
      <View style={bottomNavbar.errorContainer}>
        <View style={[Layout.fill, Layout.row]}>
          <Text style={bottomNavbar.errorText}>{patientInsertError}</Text>
        </View>
      </View>
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
              bgColor={Colors.secondary}
              color={Colors.primary}
              iconSize={FontSize.large}
              disabled={patientInsertLoading}
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
              label={t('containers.medical_case.navigation.quit')}
              filled
              bgColor={Colors.grey}
              icon="save-quit"
              iconSize={FontSize.large}
              onPress={() => console.log('TODO')}
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
