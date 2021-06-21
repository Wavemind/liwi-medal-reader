/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'

export default async ({ page, reset = false }) => {
  const { getAll } = useDatabase()

  const newMedicalCases = await getAll('MedicalCase', page)

  const isLastBatch = newMedicalCases.length === 0

  let medicalCases

  if (reset) {
    medicalCases = newMedicalCases
  } else {
    medicalCases = store
      .getState()
      .databaseMedicalCase.getAll.item.data.concat(newMedicalCases)
  }

  return {
    data: medicalCases,
    isLastBatch,
  }
}
