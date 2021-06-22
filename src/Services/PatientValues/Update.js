/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import { RegistrationQuestions } from '@/Services/Steps'

export default async () => {
  const patient = store.getState().patient.item
  const mcNodes = store.getState().medicalCase.item.nodes

  const { updatePatientValues } = useDatabase()

  const questions = RegistrationQuestions()
  const patientValues = Object.values(mcNodes).filter(node =>
    questions.includes(node.id),
  )

  await updatePatientValues(patientValues, patient.id)
}
