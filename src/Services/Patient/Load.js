/**
 * The external imports
 */
/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ patientId }) => {
  const { findBy } = useDatabase()
  const patient = await findBy('Patient', patientId)
  delete patient.medicalCases
  return patient
}
