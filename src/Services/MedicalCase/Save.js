/**
 * The external imports
 */
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { store } from '@/Store'
import UpdateDatabaseMedicalCase from '@/Store/DatabaseMedicalCase/Update'
import InsertDatabaseActivity from '@/Store/DatabaseActivity/Insert'
import ClearActivitiesMedicalCase from '@/Store/MedicalCase/ClearActivities'

export default async ({ nextStage }) => {
  const medicalCase = store.getState().medicalCase.item
  const activities = store.getState().medicalCase.item.activities

  // Update medical case
  const medicalCaseUpdateAdvancement = await store.dispatch(
    UpdateDatabaseMedicalCase.action({
      medicalCaseId: medicalCase.id,
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

      return true
    }
  }

  return false
}
