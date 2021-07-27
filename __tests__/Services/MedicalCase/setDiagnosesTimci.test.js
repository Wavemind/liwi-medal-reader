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
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { store } from '@/Store'
import { SetDiagnosesService } from '@/Services/MedicalCase'
import { setBirthDate } from '../../Utils/BirthDate'
import { setAnswer } from '../../Utils/Answer'

beforeAll(async () => {
  const algorithmFile = require('../../timci.json')
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

describe('Final diagnosis are included / excluded correctly', () => {
  it('Basic test - should include uncomplicated lymphadenopathy most', async () => {
    await setAnswer(5805, 4685) // CC Fever
    await setAnswer(5533, 4056)
    await setAnswer(6083, 4835)
    await setAnswer(5185, 3447)
    await setAnswer(6082, 4833)
    await setAnswer(5564, 4126)

    await setAnswer(5822, 8711)
    const state = store.getState()

    expect(state.medicalCase.item.nodes[6148]).toEqual(4968)

    // expect(result.diagnosis.excluded).toEqual(expect.arrayContaining([208])) // Uncomplicated infectious lymphadenopathy
    // expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([209])) // Uncomplicated lymphadenopathy
  })
})
