/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import { Config } from '@/Config'

export default async ({ page, reset = false }) => {
  const { getConsentsFile } = useDatabase()

  const newConsents = await getConsentsFile(page)

  const isLastBatch = newConsents.length < Config.ELEMENT_PER_PAGE

  let consents

  if (reset) {
    consents = newConsents
  } else {
    consents = store
      .getState()
      .databasePatient.getAllWithConsent.item.data.concat(newConsents)
  }

  return {
    data: consents,
    isLastBatch,
  }
}
