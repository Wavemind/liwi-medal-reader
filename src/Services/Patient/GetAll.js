/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import { Config } from '@/Config'

export default async ({ page, reset = false }) => {
  const { getAll } = useDatabase()

  const newPatients = await getAll('Patient', page)

  const isLastBatch = newPatients.length < Config.ELEMENT_PER_PAGE

  let patients

  if (reset) {
    patients = newPatients
  } else {
    patients = store
      .getState()
      .databasePatient.getAll.item.data.concat(newPatients)
  }

  return {
    data: patients,
    isLastBatch,
  }
}
