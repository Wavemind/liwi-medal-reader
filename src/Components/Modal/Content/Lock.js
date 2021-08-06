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
import { navigate } from '@/Navigators/Root'
import LockMedicalCase from '@/Store/DatabaseMedicalCase/Lock'
import LoadPatient from '@/Store/Patient/Load'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'

const Lock = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const medicalCase = useSelector(state => state.medicalCase.item)

  /**
   * Sets the mac_address and clinician to the current values and navigates to the medicalCase
   */
  const handleForceUnlock = async () => {
    await dispatch(LockMedicalCase.action({ medicalCaseId: medicalCase.id }))
    await dispatch(LoadPatient.action({ patientId: medicalCase.patient_id }))

    await dispatch(ToggleVisibility.action({}))
    navigate('StageWrapper', {
      stageIndex: medicalCase.advancement.stage,
      stepIndex: medicalCase.advancement.step,
    })
  }

  /**
   * Closes the modal and navigates to the MedicalCaseSummary page
   */
  const handleSummary = async () => {
    await dispatch(ToggleVisibility.action({}))
    await dispatch(LoadPatient.action({ patientId: medicalCase.patient_id }))
    navigate('MedicalCaseSummary')
  }

  return (
    <View>
      <Text style={modal.header}>{t('components.modals.lock.title')}</Text>
      <Text style={modal.body}>
        {t('components.modals.lock.content', { name: medicalCase.clinician })}
      </Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label={t('components.modals.lock.unlock_button')}
          filled
          onPress={handleForceUnlock}
          bgColor={Colors.grey}
          color={Colors.white}
          fullWidth={false}
        />
        <SquareButton
          label={t('components.modals.lock.summary_button')}
          filled
          onPress={handleSummary}
          bgColor={Colors.primary}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default Lock
