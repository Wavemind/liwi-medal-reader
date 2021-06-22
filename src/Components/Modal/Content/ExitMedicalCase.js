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
import SquareButton from '@/Components/Buttons/SquareButton'
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

  /**
   * Redirect user to home page and clear medical case store
   */
  const exitWithoutSave = async () => {
    await dispatch(ToggleVisibility.action({}))
    navigateAndSimpleReset('Home', { destroyCurrentConsultation: true })
  }

  /**
   * Save in database current medical case and redirect user to home page and clear medical case store
   */
  const exitAndSave = async () => {
    const medicalCaseSaved = await SaveMedicalCaseService(0)
    if (medicalCaseSaved) {
      await dispatch(ToggleVisibility.action({}))
      navigateAndSimpleReset('Home', { destroyCurrentConsultation: true })
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
          bgColor={Colors.red}
          fullWidth={false}
        />
        <SquareButton
          label={t('components.modals.exitMedicalCase.exitWithoutSave')}
          filled
          onPress={exitWithoutSave}
          bgColor={Colors.grey}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default ExitMedicalCase
