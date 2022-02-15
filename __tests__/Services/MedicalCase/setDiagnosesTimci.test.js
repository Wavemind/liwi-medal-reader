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
  const algorithmFile = require('../../version_34.json')
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
  await setBirthDate(store, 740)
  await setAnswer(5139, 3363) // I'm a male
})

describe('Final diagnosis are included / excluded correctly in Timci Tanzania ', () => {
  it('Testing question sequence behaviour', async () => {
    await setAnswer(5805, 4685) // CC Fever
    await setAnswer(5533, 4056) // Fever last 2 days => yes
    await setAnswer(6083, 4835) // Convulsing now  => No
    await setAnswer(5185, 3447) // Unconscious or Lethargic => No
    await setAnswer(6082, 4833) // Convulsions in present illness => No
    await setAnswer(5564, 4126) // "Malaria rapid diagnostic test ==> Negative

    const state = store.getState()

    expect(state.medicalCase.item.nodes[6148].answer).toEqual(4968)
  })
})
