/**
 * The external imports
 */
import differenceInDays from 'date-fns/differenceInDays'
import startOfToday from 'date-fns/startOfToday'

/**
 * The internal imports
 */
import useDatabase from '@/Services/Database/useDatabase'

export default async () => {
  const { getMedicalCases } = useDatabase()
  const medicalCases = await getMedicalCases()

  return medicalCases.filter(
    medicalCase =>
      medicalCase.synchronizedAt === 0 &&
      (medicalCase.closedAt !== 0 ||
        differenceInDays(new Date(medicalCase.createdAt), startOfToday()) >= 7),
  )
}

// 26.08.2021 10:30 >
