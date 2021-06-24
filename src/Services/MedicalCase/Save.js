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

export default async ({ nextStage, nextStep }) => {
  const medicalCase = store.getState().medicalCase.item
  const activities = store.getState().medicalCase.item.activities

  // Update medical case
  const medicalCaseUpdateAdvancement = await store.dispatch(
    UpdateDatabaseMedicalCase.action({
      medicalCaseId: medicalCase.id,
      fields: [
        { name: 'stage', value: nextStage || medicalCase.advancement.stage },
        { name: 'step', value: medicalCase.advancement.step },
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
        message: 'Save',
        description: 'Medical case saved successfully',
        type: 'success',
        duration: 3000,
      })

      return true
    }
  }

  return false
}
