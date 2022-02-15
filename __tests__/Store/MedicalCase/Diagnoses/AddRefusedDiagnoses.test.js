import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'

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

describe('Handle refused diagnosis addition', () => {
  it('should add a refused diagnosis', async () => {
    const diagnosisId = 60

    store.dispatch(
      AddRefusedDiagnoses.action({
        diagnosisId,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.refused.includes(diagnosisId),
    ).toBe(true)
  })
})
