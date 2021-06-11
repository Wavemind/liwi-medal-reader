import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
})

describe('Handle agreed diagnosis addition', () => {
  it('should add an agreed diagnosis', async () => {
    const algorithm = store.getState().algorithm.item
    const nodeId = 60
    const node = algorithm.nodes[nodeId]

    store.dispatch(
      AddAgreedDiagnoses.action({
        diagnosisId: nodeId,
        diagnosisContent: {
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
        },
      }),
    )

    expect(store.getState().medicalCase.item.diagnosis.agreed).toStrictEqual({
      60: {
        id: 60,
        managements: [1808, 3352, 3354],
        drugs: {
          proposed: [1660, 1709, 3360, 3501],
          agreed: {},
          refused: [],
          additional: {},
        },
      },
    })
  })
})
