import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import RemoveCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveCustomDiagnoses'

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const nodeId = '60'
  const diagnosisContent = {
    id: nodeId,
    name: 'COVID',
    drugs: {},
  }
  await store.dispatch(
    AddCustomDiagnoses.action({ diagnosisId: nodeId, diagnosisContent }),
  )
})

describe('Handle custom diagnosis removal', () => {
  const nodeId = '60'

  it('should start with a custom diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.custom).includes(
        nodeId,
      ),
    ).toBe(true)
  })

  it('should remove a custom diagnosis', async () => {
    store.dispatch(
      RemoveCustomDiagnoses.action({
        diagnosisId: nodeId,
      }),
    )

    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.custom).includes(
        nodeId,
      ),
    ).toBe(false)
  })
})
