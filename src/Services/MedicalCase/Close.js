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
import UnlockMedicalCase from '@/Store/DatabaseMedicalCase/Unlock'

export default async () => {
  const medicalCase = store.getState().medicalCase.item
  const activities = store.getState().medicalCase.item.activities

  // Update medical case
  const medicalCaseUpdateAdvancement = await store.dispatch(
    UpdateDatabaseMedicalCase.action({
      medicalCaseId: medicalCase.id,
      fields: [
        { name: 'stage', value: 0 },
        { name: 'step', value: 0 },
        { name: 'closedAt', value: new Date().getTime() },
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

    // Remove medical case from store
    if (isFulfilled(addActivity)) {
      await store.dispatch(
        UnlockMedicalCase.action({ medicalCaseId: medicalCase.id }),
      )

      return true
    }
  }

  return false
}
