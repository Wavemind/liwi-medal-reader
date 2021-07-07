/**
 * The external imports
 */
import differenceInDays from 'date-fns/differenceInDays'
import startOfToday from 'date-fns/startOfToday'

/**
 * The internal imports
 */
import { store } from '@/Store'
import useDatabase from '@/Services/Database/useDatabase'

export default async currentRoute => {
  const medicalCaseInStore =
    Object.keys(store.getState().medicalCase.item).length > 0

  if (currentRoute === 'Synchronization' || medicalCaseInStore) {
    return false
  }

  const { getMedicalCases } = useDatabase()

  const medicalCases = await getMedicalCases()

  const medicalCasesToSync = medicalCases.filter(
    medicalCase =>
      differenceInDays(new Date(medicalCase.createdAt), startOfToday()) >= 7 &&
      medicalCase.synchronizedAt === 0,
  )

  return medicalCasesToSync.length > 0
}
