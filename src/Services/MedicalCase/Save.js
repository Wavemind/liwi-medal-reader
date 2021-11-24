/**
 * The external imports
 */
import { isFulfilled } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'

/**
 * The internal imports
 */
import { store } from '@/Store'
import UpdateDatabaseMedicalCase from '@/Store/DatabaseMedicalCase/Update'
import InsertDatabaseActivity from '@/Store/DatabaseActivity/Insert'
import ClearActivitiesMedicalCase from '@/Store/MedicalCase/ClearActivities'
import i18n from '@/Translations/index'

export default async ({ stageIndex, stepIndex }) => {
  const medicalCase = store.getState().medicalCase.item
  const activities = store.getState().medicalCase.item.activities

  // Update medical case
  const medicalCaseUpdateAdvancement = await store.dispatch(
    UpdateDatabaseMedicalCase.action({
      medicalCaseId: medicalCase.id,
      fields: [
        { name: 'stage', value: stageIndex },
        { name: 'step', value: stepIndex },
        {
          name: 'json',
          value: JSON.stringify({
            comment: medicalCase.comment,
            consent: medicalCase.consent,
            diagnosis: medicalCase.diagnosis,
            nodes: medicalCase.nodes,
            metadata: {
              appVersion: medicalCase.appVersion,
            },
          }),
        },
      ],
    }),
  )

  // Add activities
  if (isFulfilled(medicalCaseUpdateAdvancement)) {
    const addActivity = await store.dispatch(
      InsertDatabaseActivity.action({
        medicalCaseId: medicalCase.id,
        activities,
      }),
    )

    // Remove sended activities
    if (isFulfilled(addActivity)) {
      await store.dispatch(ClearActivitiesMedicalCase.action())

      showMessage({
        message: i18n.t('database.success.message'),
        description: i18n.t('database.success.description'),
        type: 'success',
        duration: 3000,
      })

      return true
    }
  }

  showMessage({
    message: i18n.t('database.error.message'),
    description: i18n.t('database.error.description'),
    type: 'danger',
    duration: 3000,
  })

  return false
}
