/**
 * The external imports
 */
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import CreatePatient from '@/Store/Patient/Create'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import { store } from '@/Store'
import { setBirthDate } from '../../Utils/BirthDate'
import { setAnswer } from '../../Utils/Answer'

beforeAll(async () => {
  const algorithmFile = require('../../version_41.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
})

beforeEach(async () => {
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
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
  await setBirthDate(store, 122)
  await setAnswer(9042, 7330) // I'm a male
})

describe('Final diagnosis are included / excluded correctly in TIMCI Senegale ', () => {
  it('Should be propose uncomplicated hernia', async () => {
    
  })
})
