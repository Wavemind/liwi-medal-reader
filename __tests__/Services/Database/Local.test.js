/**
 * @format
 */
//import useLocalInterface from '@/Services/Database/Local/useLocalInterface'
import uuid from 'uuid'

/**
 * The internal imports
 */
import CreatePatient from '@/Store/Patient/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import InsertPatient from '@/Store/Database/InsertPatient'

import { store } from '@/Store/index'
import useDatabase from '@/Services/Database/useDatabase'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')

  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
})

beforeEach(async () => {
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
})

describe('getAll should return all elements of a specific object', () => {
  it('should return an empty array ', async () => {
    const { getAll } = useDatabase()
    const allPatients = await getAll('Patient')
    expect(allPatients).toStrictEqual([])
  })
  it('should return an array with 1 patient from the database', async () => {
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
    await store.dispatch(InsertPatient.action())
    const allPatients = await getAll('Patient')
    expect(allPatients.length).toStrictEqual(1)
    expect(allPatients[0].uid).toStrictEqual(uid)
  })
  it('should return an array with the 2 patients from the database', async () => {
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
    await store.dispatch(InsertPatient.action())
    const allPatients = await getAll('Patient')
    expect(allPatients.length).toStrictEqual(2)
    expect(allPatients[1].uid).toStrictEqual(uid)
  })
  it('should return an empty array of medical case', async () => {
    const { getAll } = useDatabase()
    const allMedicalCases = await getAll('MedicalCase')
    expect(allMedicalCases.length).toStrictEqual(2)
  })
})

describe('getConsentsFile should return all consent Files', () => {
  it('', async () => {})
})

describe('insert should insert an object in the database', () => {
  it('', async () => {})
})

describe('lockMedicalCase should lock a medical case', () => {
  it('', async () => {})
})

describe('push should add an object to another object', () => {
  it('', async () => {})
})

describe('unlockMedicalCase should unlock a medical case', () => {
  it('', async () => {})
})

describe('update should update an object ', () => {
  it('', async () => {})
})
