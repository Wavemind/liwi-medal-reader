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
  const mcInStore = Object.keys(store.getState().medicalCase.item).length > 0
  if (currentRoute === 'Synchronization' || mcInStore) {
    return false
  }

  const { getMedicalCases } = useDatabase()

  const mcsInDB = await getMedicalCases()
  const mcsToSync = mcsInDB.filter(
    mc => differenceInDays(new Date(mc.closedAt), startOfToday()) >= 7,
  )

  return mcsToSync.length > 0
}
