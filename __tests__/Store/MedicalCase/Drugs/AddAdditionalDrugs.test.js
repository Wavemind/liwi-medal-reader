import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import AddAdditionalDrugs from '@/Store/MedicalCase/Drugs/AddAdditionalDrugs'

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
  const node = algorithm.nodes[diagnosisId]
  const diagnosisContent = {
    id: diagnosisId,
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
    AddAgreedDiagnoses.action({ diagnosisId, diagnosisContent }),
  )
  await store.dispatch(
    AddAdditionalDiagnoses.action({
      newAdditionalDiagnoses: { [diagnosisId]: diagnosisContent },
    }),
  )
})

describe('Handle additional drugs addition', () => {
  const diagnosisId = 60
  const drugId = 1679

  it('should start with an agreed diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.agreed).includes(
        diagnosisId.toString(),
      ),
    ).toBe(true)
  })

  it('should add additional drugs to an agreed diagnostic', async () => {
    store.dispatch(
      AddAdditionalDrugs.action({
        diagnosisKey: 'agreed',
        diagnosisId,
        newAdditionalDrugs: {
          [drugId]: {
            id: drugId,
            duration: '',
          },
        },
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.agreed[diagnosisId].drugs
        .additional,
    ).toStrictEqual({
      [drugId]: {
        id: drugId,
        duration: '',
      },
    })
  })

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(diagnosisId.toString()),
    ).toBe(true)
  })

  it('should add additional drugs to an additional diagnostic', async () => {
    store.dispatch(
      AddAdditionalDrugs.action({
        diagnosisKey: 'additional',
        diagnosisId,
        newAdditionalDrugs: {
          [drugId]: {
            id: drugId,
            duration: '',
          },
        },
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.additional[diagnosisId].drugs
        .additional,
    ).toStrictEqual({
      [drugId]: {
        id: drugId,
        duration: '',
      },
    })
  })
})
