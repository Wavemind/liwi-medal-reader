import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { getAvailableHealthcare } from '@/Utils/Drug'
import { setAnswer } from '../../../Utils/Answer'

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
    await setAnswer(50, 40)
    const availableDrugs = getAvailableHealthcare(node, 'drugs')
    store.dispatch(
      AddAgreedDiagnoses.action({
        diagnosisId: nodeId,
        diagnosisContent: {
          id: nodeId,
          managements: Object.values(node.managements).map(
            management => management.id,
          ),
          drugs: {
            proposed: availableDrugs,
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
        managements: [1808, 3354],
        drugs: {
          proposed: [1660],
          agreed: {},
          refused: [],
          additional: {},
        },
      },
    })
  })

  it('should overwrite the existing diagnosis if a diagnosis with the same id is given', async () => {
    const algorithm = store.getState().algorithm.item
    const nodeId = 60
    const node = algorithm.nodes[nodeId]

    await store.dispatch(
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

    await store.dispatch(
      AddAgreedDiagnoses.action({
        diagnosisId: nodeId,
        diagnosisContent: {
          id: nodeId,
          managements: [],
          drugs: {
            proposed: [],
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
        managements: [],
        drugs: {
          proposed: [],
          agreed: {},
          refused: [],
          additional: {},
        },
      },
    })
  })
})
