/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ medicalCaseId, fields }) => {
  const { update } = useDatabase()
  await update('MedicalCase', medicalCaseId, fields)
}
