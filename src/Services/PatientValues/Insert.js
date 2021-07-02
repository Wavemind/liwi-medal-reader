/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import { RegistrationQuestionsService } from '@/Services/Steps'

export default async () => {
  const patient = store.getState().patient.item
  const mcNodes = store.getState().medicalCase.item.nodes

  const { insertPatientValues } = useDatabase()

  const questions = RegistrationQuestionsService()
  const patientValues = Object.values(mcNodes).filter(node =>
    questions.includes(node.id),
  )

  await insertPatientValues(patientValues, patient.id)
}
