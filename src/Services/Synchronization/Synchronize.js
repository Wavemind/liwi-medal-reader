/**
 * The external imports
 */
import {
  DocumentDirectoryPath,
  mkdir,
  unlink,
  writeFile,
} from 'react-native-fs'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { zip } from 'react-native-zip-archive'

/**
 * The internal imports
 */
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import UpdateDatabaseMedicalCase from '@/Store/DatabaseMedicalCase/Update'

/**
 * Transforms file path into usable path
 * @param path
 * @returns {*}
 */
const normalizeFilePath = path => {
  return path.startsWith('file://') ? path.slice(7) : path
}

export default async medicalCasesToSync => {
  const { getActivities, findBy } = useDatabase()
  const state = store.getState()
  const mainDataUrl = state.auth.medAlDataURL

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
        ...medicalCase,
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

  // Upload process
  const requestResult = await ReactNativeBlobUtil.fetch(
    'POST',
    `${mainDataUrl}/api/v1/sync_medical_cases`,
    {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
    [
      {
        name: 'file',
        filename: 'file.zip',
        data: ReactNativeBlobUtil.wrap(path),
      },
    ],
  )
    .uploadProgress((written, total) => {
      console.log('uploaded', written / total)
    })
    .catch(err => {
      return Promise.reject({ message: err })
    })

  const parsedResult = JSON.parse(requestResult.data)

  if (requestResult !== null && parsedResult.status === 200) {
    await unlink(path)

    // Reset medicalCases to sync if request success
    medicalCasesToSync.forEach(async medicalCase => {
      await store.dispatch(
        UpdateDatabaseMedicalCase.action({
          medicalCaseId: medicalCase.id,
          fields: [{ name: 'synchronizedAt', value: new Date().getTime() }],
        }),
      )
    })
  } else {
    return Promise.reject({ message: parsedResult.message })
  }
}
