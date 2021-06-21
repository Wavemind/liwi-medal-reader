/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import { RegistrationQuestions } from '@/Services/Steps'

export default async () => {
  const {
    patient: { item: currentPatient },
    medicalCase: {
      item: { nodes: mcNodes },
    },
  } = store.getState()

  const { savePatientValues } = useDatabase()

  const questions = RegistrationQuestions()
  const patientValues = Object.values(mcNodes).filter(node =>
    questions.includes(node.id),
  )

  await savePatientValues(patientValues, currentPatient.id)
}
