/**
 * The external imports
 */
import differenceInDays from 'date-fns/differenceInDays'
import startOfToday from 'date-fns/startOfToday'

/**
 * The internal imports
 */
import useDatabase from '@/Services/Database/useDatabase'
import { store } from '@/Store'

export default async () => {
  const { getMedicalCases } = useDatabase()
  const medicalCases = await getMedicalCases()

  const algorithm = store.getState().algorithm.item
  return medicalCases.filter(
    medicalCase =>
      medicalCase.synchronizedAt === 0 &&
      (!algorithm.config.consent_management || medicalCase.consent) &&
      (medicalCase.closedAt !== 0 ||
        differenceInDays(new Date(medicalCase.createdAt), startOfToday()) >= 7),
  )
}
