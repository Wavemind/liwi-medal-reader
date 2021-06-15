import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'
import RemoveRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveRefusedDiagnoses'

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const diagnosisId = 60
  await store.dispatch(AddRefusedDiagnoses.action({ diagnosisId }))
})

describe('Handle refused diagnosis removal', () => {
  const diagnosisId = 60

  it('should start with a refused diagnosis', () => {
    expect(
      store.getState().medicalCase.item.diagnosis.refused.includes(diagnosisId),
    ).toBe(true)
  })

  it('should remove a refused diagnosis', async () => {
    store.dispatch(RemoveRefusedDiagnoses.action({ diagnosisId }))

    expect(
      store.getState().medicalCase.item.diagnosis.refused.includes(diagnosisId),
    ).toBe(false)
  })
})
