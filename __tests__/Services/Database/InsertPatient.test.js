/**
 * The external imports
 */
import uuid from 'react-native-uuid'
/**
 * The internal imports
 */
import CreatePatient from '@/Store/Patient/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import useDatabase from '@/Services/Database/useDatabase'
import InsertPatient from '@/Store/Database/Patient/Insert'

import { store } from '@/Store/index'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')

  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
})

describe('insertPatient should add a patient in the Database', () => {
  it('should add a new element in the patient database', async () => {
    const { getAll } = useDatabase()
    const uid = uuid.v4()
    await store.dispatch(
      CreatePatient.action({
        facility: {
          uid,
          study_id: 'Test Study',
          group_id: 7,
        },
        otherFacility: {},
      }),
    )
    const patientsOld = await getAll('Patient')
    await store.dispatch(InsertPatient.action({}))
    const patientsNew = await getAll('Patient')

    expect(patientsNew.length).toEqual(patientsOld.length + 1)
  })

  it('should add a new element in the medical case database', async () => {
    const algorithm = store.getState().algorithm.item
    await store.dispatch(CreateMedicalCase.action({ algorithm }))
    const { getAll } = useDatabase()
    const uid = uuid.v4()
    await store.dispatch(
      CreatePatient.action({
        facility: {
          uid,
          study_id: 'Test Study',
          group_id: 7,
        },
        otherFacility: {},
      }),
    )
    const medicalCasesOld = await getAll('MedicalCase')
    await store.dispatch(InsertPatient.action({}))
    const medicalCasesNew = await getAll('MedicalCase')
    expect(medicalCasesNew.length).toEqual(medicalCasesOld.length + 1)
  })
})
