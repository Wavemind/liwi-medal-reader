import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'

beforeAll(async () => {
  const algorithmFile = require('../../../version_1.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const diagnosisId = 60
  const drugId = 1679
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
  await store.dispatch(
    AddAgreedDrugs.action({
      diagnosisKey: 'agreed',
      diagnosisId,
      drugId,
    }),
  )
  await store.dispatch(
    AddAgreedDrugs.action({
      diagnosisKey: 'additional',
      diagnosisId,
      drugId,
    }),
  )
})

describe('Handle agreed drugs removal', () => {
  const diagnosisId = 60
  const drugId = 1679

  it('should start with an agreed diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.agreed).includes(
        diagnosisId.toString(),
      ),
    ).toBe(true)
  })

  it('should start with agreed drugs in an agreed diagnosis', () => {
    expect(
      store.getState().medicalCase.item.diagnosis.agreed[diagnosisId].drugs
        .agreed,
    ).toStrictEqual({
      [drugId]: {
        id: drugId,
      },
    })
  })

  it('should remove an agreed drug from an agreed diagnostic', async () => {
    store.dispatch(
      RemoveAgreedDrugs.action({
        diagnosisKey: 'agreed',
        diagnosisId,
        drugId,
      }),
    )

    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.agreed[diagnosisId].drugs
          .agreed,
      ).includes(drugId.toString()),
    ).toBe(false)
  })

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(diagnosisId.toString()),
    ).toBe(true)
  })

  it('should start with agreed drugs in an additional diagnosis', () => {
    expect(
      store.getState().medicalCase.item.diagnosis.additional[diagnosisId].drugs
        .agreed,
    ).toStrictEqual({
      [drugId]: {
        id: drugId,
      },
    })
  })

  it('should remove an agreed drug from an additional diagnostic', async () => {
    store.dispatch(
      RemoveAgreedDrugs.action({
        diagnosisKey: 'additional',
        diagnosisId,
        drugId,
      }),
    )

    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional[diagnosisId]
          .drugs.agreed,
      ).includes(drugId.toString()),
    ).toBe(false)
  })
})
