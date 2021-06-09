/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ medicalCaseId }) => {
  const { findBy } = useDatabase()
  const medicalCase = await findBy('MedicalCase', medicalCaseId)
  delete medicalCase.patient
  return medicalCase
}
