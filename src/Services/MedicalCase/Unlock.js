/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ medicalCaseId }) => {
  const { unlock } = useDatabase()
  await unlock(medicalCaseId)
}
