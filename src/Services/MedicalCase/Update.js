/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ medicalCaseId, fields }) => {
  const { update } = useDatabase()
  console.log(medicalCaseId, fields)
  await update('MedicalCase', medicalCaseId, fields)
}
