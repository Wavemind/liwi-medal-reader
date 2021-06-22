/**
 * The external imports
 */
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import CreatePatient from '@/Store/Patient/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { TreatmentConditionsQuestions } from '@/Services/Steps'
import { setBirthDate } from '../../Utils/BirthDate'

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
  await setBirthDate(store, 4, 'year')
})

describe('Treatment condition questions ', () => {
  it('should retrieve the Treatment condition based on agreed final diagnoses', async () => {
    const state = store.getState()
    const nodes = state.algorithm.item.nodes
    store.dispatch(
      AddAgreedDiagnoses.action({
        diagnosisId: 83,
        diagnosisContent: {
          id: 83,
          managements: Object.values(nodes[83].managements).map(
            management => management.id,
          ),
          drugs: {
            proposed: Object.values(nodes[83].drugs).map(drug => drug.id),
            agreed: {},
            refused: [],
            additional: {},
          },
        },
      }),
    )
    const questions = TreatmentConditionsQuestions()
    expect(questions).toEqual([2103])
  })
})
