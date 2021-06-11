/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'

export default async ({ page }) => {
  const { getAll } = useDatabase()

  const newMedicalCases = await getAll('MedicalCase', page)

  const isLastBatch = newMedicalCases.length === 0

  const medicalCases = store
    .getState()
    .database.medicalCase.getAll.item.data.concat(newMedicalCases)

  return {
    data: medicalCases,
    isLastBatch,
  }
}
