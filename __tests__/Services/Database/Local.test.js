/**
 * @format
 */
//import useLocalInterface from '@/Services/Database/Local/useLocalInterface'
import uuid from 'uuid'

/**
 * The internal imports
 */
import createPatientService from '@/Services/Patient/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import createMedicalCase from '@/Store/MedicalCase/Create'

import { store } from '@/Store/index'
import useDatabase from '@/Services/Database/useDatabase'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')

  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(createMedicalCase.action({ algorithm }))
})

describe('findBy should return a patient', () => {})

describe('getAll should return all elements of a specific object', () => {
  it('should return an empty array ', async () => {
    const { getAll } = useDatabase()
    const allPatients = await getAll('Patient')
    expect(allPatients).toStrictEqual([])
  })

  it('should return an array with 1 patient from the database', async () => {
    const { insert, getAll } = useDatabase()
    const uid = uuid.v4()
    const patient = await createPatientService({
      facility: {
        uid,
        study_id: 'Test Study',
        group_id: 7,
      },
      otherFacility: {},
    })
    await insert('Patient', patient)

    const allPatients = await getAll('Patient')
    expect(allPatients.length).toStrictEqual(1)
    expect(allPatients[0].uid).toStrictEqual(uid)
  })

  it('should return an array with the 2 patients from the database', async () => {
    const { createPatient, getAll } = useDatabase()
    const uid = uuid.v4()
    const medicalCase = store.getState().medicalCase.item
    const patient = await createPatientService({
      facility: {
        uid,
        study_id: 'Test Study',
        group_id: 7,
      },
      otherFacility: {},
    })
    await createPatient(patient, medicalCase)

    const allPatients = await getAll('Patient')
    expect(allPatients.length).toStrictEqual(2)
    expect(allPatients[1].uid).toStrictEqual(uid)
  })

  it('should return an empty array of medical case', async () => {
    const { getAll } = useDatabase()
    const allMedicalCases = await getAll('MedicalCase')
    expect(allMedicalCases).toStrictEqual([])
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

describe('findBy should find an object based on a query', () => {
  it('', async () => {})
})
