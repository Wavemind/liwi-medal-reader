/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { SquareButton } from '@/Components'
import { useTheme } from '@/Theme'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { SaveMedicalCaseService } from '@/Services/MedicalCase'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'

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

  /**
   * Redirect user to home page and clear medical case store
   */
  const exitWithoutSave = async () => {
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
    const medicalCaseSaved = await SaveMedicalCaseService({
      stageIndex,
      stepIndex,
    })
    if (medicalCaseSaved) {
      await dispatch(ToggleVisibility.action({}))
      navigateAndSimpleReset(routeName, {
        ...routeParams,
        destroyCurrentConsultation: true,
      })
    }
  }

  return (
    <View>
      <Text style={modal.header}>
        {t('components.modals.exitMedicalCase.title')}
      </Text>
      <Text style={modal.body}>
        {t('components.modals.exitMedicalCase.content')}
      </Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label={t('components.modals.exitMedicalCase.exitAndSave')}
          filled
          disabled={!patientSavedInDatabase}
          onPress={exitAndSave}
          bgColor={Colors.grey}
          color={Colors.white}
          fullWidth={false}
        />
        <SquareButton
          label={t('components.modals.exitMedicalCase.exitWithoutSave')}
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
