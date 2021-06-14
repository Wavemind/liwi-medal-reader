import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import RemoveAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAgreedDiagnoses'

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const nodeId = 60
  const node = algorithm.nodes[nodeId]
  const diagnosisContent = {
    id: nodeId,
    managements: Object.values(node.managements).map(
      management => management.id,
    ),
    drugs: {
      proposed: Object.values(node.drugs).map(drug => drug.id),
      agreed: {},
      refused: [],
      additional: {},
    },
  }
  await store.dispatch(
    AddAgreedDiagnoses.action({ diagnosisId: nodeId, diagnosisContent }),
  )
})

describe('Handle agreed diagnosis removal', () => {
  const nodeId = 60

  it('should start with an agreed diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.agreed).includes(
        nodeId.toString(),
      ),
    ).toBe(true)
  })

  it('should remove an agreed diagnosis', async () => {
    store.dispatch(
      RemoveAgreedDiagnoses.action({
        diagnosisId: nodeId,
      }),
    )

    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.agreed).includes(
        nodeId.toString(),
      ),
    ).toBe(false)
  })
})
