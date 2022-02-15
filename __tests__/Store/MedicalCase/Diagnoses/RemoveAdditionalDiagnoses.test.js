import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import RemoveAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAdditionalDiagnoses'

beforeAll(async () => {
  const algorithmFile = require('../../../version_1.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const nodeId = 60
  const node = algorithm.nodes[nodeId]
  const newAdditionalDiagnoses = {
    [nodeId]: {
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
  }
  await store.dispatch(
    AddAdditionalDiagnoses.action({ newAdditionalDiagnoses }),
  )
})

describe('Handle additional diagnosis removal', () => {
  const nodeId = 60

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(nodeId.toString()),
    ).toBe(true)
  })

  it('should remove an additional diagnosis', async () => {
    store.dispatch(
      RemoveAdditionalDiagnoses.action({
        diagnosisId: nodeId,
      }),
    )

    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(nodeId.toString()),
    ).toBe(false)
  })
})
