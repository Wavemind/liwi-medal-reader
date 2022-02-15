import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'

beforeAll(async () => {
  const algorithmFile = require('../../../version_1.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
})

describe('Handle custom diagnosis addition', () => {
  it('should add a custom diagnosis', async () => {
    const nodeId = 60

    store.dispatch(
      AddCustomDiagnoses.action({
        diagnosisId: nodeId,
        diagnosisContent: {
          id: nodeId,
          name: 'COVID',
          drugs: {},
        },
      }),
    )

    expect(store.getState().medicalCase.item.diagnosis.custom).toStrictEqual({
      60: {
        id: 60,
        name: 'COVID',
        drugs: {},
      },
    })
  })
})
