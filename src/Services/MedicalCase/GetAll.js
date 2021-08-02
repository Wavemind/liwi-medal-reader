/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import { Config } from '@/Config'
import { UniqObject } from '@/Utils'

export default async ({ page, reset = false, params }) => {
  const { getAll } = useDatabase()
  const newMedicalCases = await getAll('MedicalCase', page, params)

  const isLastBatch = newMedicalCases.length < Config.ELEMENT_PER_PAGE

  let medicalCases

  if (reset) {
    medicalCases = newMedicalCases
  } else {
    medicalCases = store
      .getState()
      .databaseMedicalCase.getAll.item.data.concat(newMedicalCases)
  }
  return {
    data: UniqObject(medicalCases),
    isLastBatch,
  }
}
