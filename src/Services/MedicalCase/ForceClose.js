/**
 * The external imports
 */
import differenceInHours from 'date-fns/differenceInHours'

/**
 * The internal imports
 */
import LocalInterface from '@/Services/Database/Local/useLocalInterface'

export default async () => {
  const medicalCases = await LocalInterface().getMedicalCases()

  const todayMinus12Hours = new Date()
  todayMinus12Hours.setHours(todayMinus12Hours.getHours() - 12)

  const medicalCaseToClose = medicalCases.filter(
    medicalCase =>
      medicalCase.closedAt === 0 &&
      differenceInHours(todayMinus12Hours, new Date(medicalCase.updatedAt)) >=
        0,
  )

  medicalCaseToClose.forEach(async medicalCase =>
    LocalInterface().update('MedicalCase', medicalCase.id, [
      { name: 'closedAt', value: new Date().getTime() },
      { name: 'forceClosed', value: true },
    ]),
  )
}
