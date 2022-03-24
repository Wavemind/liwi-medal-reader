/**
 * The internal imports
 */
import LocalInterface from '@/Services/Database/Local/useLocalInterface'
import RemoteInterface from '@/Services/Database/Remote/useRemoteInterface'

export default async () => {
  const patients = await LocalInterface().getAll('Patient')
  if (patients.length > 0) {
    await RemoteInterface().synchronizePatients(patients)
  }
}
