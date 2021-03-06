/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'

export default async ({ medicalCaseId, activities }) => {
  const { insertActivities } = useDatabase()
  await insertActivities(
    medicalCaseId,
    activities.filter(activity => activity.nodes.length > 0),
  )
}
