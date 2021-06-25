/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'

export default async () => {
  const state = store.getState()
  const { insertMedicalCase } = useDatabase()
  await insertMedicalCase(state.patient.item.id, state.medicalCase.item)
}
