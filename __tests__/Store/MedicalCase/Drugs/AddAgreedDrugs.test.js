import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'

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
  await store.dispatch(
    AddAdditionalDiagnoses.action({
      newAdditionalDiagnoses: { [nodeId]: diagnosisContent },
    }),
  )
})

describe('Handle agreed drugs addition', () => {
  const diagnosisId = 60
  const drugId = 1679

  it('should start with an agreed diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.agreed).includes(
        diagnosisId.toString(),
      ),
    ).toBe(true)
  })

  it('should add agreed drugs to an agreed diagnostic', async () => {
    store.dispatch(
      AddAgreedDrugs.action({
        diagnosisKey: 'agreed',
        diagnosisId,
        drugId,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.agreed[diagnosisId].drugs
        .agreed,
    ).toStrictEqual({
      [drugId]: { id: drugId },
    })
  })

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(diagnosisId.toString()),
    ).toBe(true)
  })

  it('should add agreed drugs to an additional diagnostic', async () => {
    store.dispatch(
      AddAgreedDrugs.action({
        diagnosisKey: 'additional',
        diagnosisId,
        drugId,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.additional[diagnosisId].drugs
        .agreed,
    ).toStrictEqual({
      [drugId]: { id: drugId },
    })
  })
})
