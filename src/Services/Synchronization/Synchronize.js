/**
 * The external imports
 */
import {
  DocumentDirectoryPath,
  mkdir,
  unlink,
  writeFile,
} from 'react-native-fs'
import { zip } from 'react-native-zip-archive'

/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'

/**
 * Transforms file path into usable path
 * @param path
 * @returns {*}
 */
const normalizeFilePath = path => {
  return path.startsWith('file://') ? path.slice(7) : path
}

export default async () => {
  const mainDataUrl = store.getState().healthFacility.item.main_data_ip

  const medicalCasesToSynch = store
    .getState()
    .databaseMedicalCase.getAll.item.data.filter(
      medicalCase => medicalCase.synchronizedAt === 0,
    )
  const { getActivities, findBy, update } = useDatabase()

  const folder = `${DocumentDirectoryPath}/medical_cases`
  const targetPath = `${folder}.zip`
  // Create directory
  await mkdir(folder)
  // Generate files
  await Promise.all(
    medicalCasesToSynch.map(async medicalCase => {
      const patient = await findBy('Patient', medicalCase.patient.id)
      const activities = await getActivities(medicalCase.id)

      const medicalCaseJson = JSON.stringify(
        {
          ...JSON.parse(medicalCase.json),
          patient: { ...patient, medicalCases: [] },
          activities: activities,
        },
        (key, value) => (typeof value === 'undefined' ? null : value),
      )
      await writeFile(`${folder}/${medicalCase.id}.json`, medicalCaseJson)
    }),
  )
  // Generate archive
  const path = await zip([normalizeFilePath(folder)], targetPath).catch(
    error => {
      console.log(error)
    },
  )
  await Promise.all(
    medicalCasesToSynch.map(async medicalCase => {
      await unlink(`${folder}/${medicalCase.id}.json`)
    }),
  )
  // TODO synchronize the mcs when we have client-server functionality and remove const result = null
  // const result = await synchronizeMedicalCases(mainDataUrl, path)
  const result = null
  if (result !== null && result.data_received) {
    // Reset medicalCases to sync if request success
    medicalCasesToSynch.forEach(medicalCase => {
      update('MedicalCase', medicalCase.id, {
        synchronized_at: new Date().getTime(),
      })
    })
  } else {
    return null
  }
}
