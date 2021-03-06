/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ patientId }) => {
  const { findBy } = useDatabase()
  const patient = await findBy('Patient', patientId)
  patient.savedInDatabase = true
  return patient
}
