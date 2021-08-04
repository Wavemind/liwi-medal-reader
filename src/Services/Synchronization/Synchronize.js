/**
 * The external imports
 */
import {
  DocumentDirectoryPath,
  mkdir,
  unlink,
  writeFile,
  readDir,
} from 'react-native-fs'
import { zip } from 'react-native-zip-archive'
import differenceInDays from 'date-fns/differenceInDays'
import startOfToday from 'date-fns/startOfToday'
import api from '@/Services/Synchronization/Api'

/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { GetNonSynchronizedService } from '@/Services/MedicalCase'

/**
 * Transforms file path into usable path
 * @param path
 * @returns {*}
 */
const normalizeFilePath = path => {
  return path.startsWith('file://') ? path.slice(7) : path
}

export default async () => {
  const { getActivities, findBy, update } = useDatabase()

  const medicalCasesToSync = await GetNonSynchronizedService()

  const folder = `${DocumentDirectoryPath}/medical_cases`
  const targetPath = `${folder}.zip`
  let medicalCaseJson = {}
  // Create directory
  await mkdir(folder)
  // Generate files
  await Promise.all(
    medicalCasesToSync.map(async medicalCase => {
      const patient = await findBy('Patient', medicalCase.patient.id)
      const activities = await getActivities(medicalCase.id)

      const tempMedicalCaseJson = {
        ...JSON.parse(medicalCase.json),
        id: medicalCase.id,
        version_id: medicalCase.version_id,
        patient: { ...patient, medicalCases: [] },
        activities: activities,
      }

      delete tempMedicalCaseJson.patient.savedInDatabase

      medicalCaseJson = JSON.stringify(tempMedicalCaseJson, (key, value) =>
        typeof value === 'undefined' ? null : value,
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
    medicalCasesToSync.map(async medicalCase => {
      await unlink(`${folder}/${medicalCase.id}.json`)
    }),
  )

  // TODO synchronize the mcs when we have client-server functionality and remove const result = null
  const data = new FormData()
  data.append('file', {
    name: 'file',
    filename: 'file.zip',
    uri: path,
  })

  readDir(DocumentDirectoryPath)
    .then(result => {
      console.log('GOT RESULT', result)
    })
    .catch(err => {
      console.log(err.message, err.code)
    })

  const result = await api.post('/api/sync_medical_cases', data)

  console.log('result', result)

  // if (result !== null && result.data_received) {
  //   // Reset medicalCases to sync if request success
  //   medicalCasesToSync.forEach(medicalCase => {
  //     update('MedicalCase', medicalCase.id, {
  //       synchronizedAt: new Date().getTime(),
  //     })
  //   })
  // } else {
  //   return null
  // }
}
