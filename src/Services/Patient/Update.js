/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ patientId, fields }) => {
  const { update } = useDatabase()
  await update('Patient', patientId, fields)
}
