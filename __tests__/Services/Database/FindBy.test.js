/**
 * The external imports
 */
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import CreatePatient from '@/Store/Patient/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import useDatabase from '@/Services/Database/useDatabase'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import InsertPatient from '@/Store/DatabasePatient/Insert'

import { store } from '@/Store/index'

beforeAll(async () => {
  const algorithmFile = require('../../version_1.json')

  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
})

describe('findBy should find an object based on a query', () => {
  it('should return a patient that has the same id as the one we are looking for ', async () => {
    const { findBy } = useDatabase()
    const expectedKeys = [
      'id',
      'first_name',
      'last_name',
      'birth_date',
      'birth_date_estimated',
      'birth_date_estimated_type',
      'uid',
      'study_id',
      'group_id',
      'other_uid',
      'other_study_id',
      'other_group_id',
      'reason',
      'consent',
      'consent_file',
      'createdAt',
      'updatedAt',
      'fail_safe',
      'medicalCases',
      'patientValues',
      'savedInDatabase',
    ]
    const sortedKeys = expectedKeys.sort()
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
    const id = store.getState().patient.item.id
    await store.dispatch(InsertPatient.action({}))
    const patient = await findBy('Patient', id)
    expect(patient.id).toBe(id)
    expect(Object.keys(patient).sort()).toEqual(sortedKeys)
  })
  it('should return a medical case that has the same id + same keys as the one we are looking for ', async () => {
    const { findBy } = useDatabase()
    const expectedKeys = [
      'id',
      'activities',
      'comment',
      'consent',
      'diagnosis',
      'nodes',
      'json',
      'json_version',
      'synchronizedAt',
      'advancement',
      'appVersion',
      'fail_safe',
      'patient',
      'closedAt',
      'createdAt',
      'updatedAt',
      'version_id',
    ]
    const sortedKeys = expectedKeys.sort()
    const id = store.getState().medicalCase.item.id
    const medicalCase = await findBy('MedicalCase', id)
    expect(medicalCase.id).toBe(id)
    expect(Object.keys(medicalCase).sort()).toEqual(sortedKeys)
  })
  it("should return a null if if can't find an object ", async () => {
    const { findBy } = useDatabase()
    const notId = 'I am not an ID'
    const medicalCase = await findBy('MedicalCase', notId)
    expect(medicalCase).toBe(null)
  })
})
