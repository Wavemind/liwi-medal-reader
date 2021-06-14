/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'

export default async () => {
  const state = store.getState()
  const { insertPatient } = useDatabase()
  await insertPatient(state.patient.item, state.medicalCase.item)
}
