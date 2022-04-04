import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import AddAdditionalDrugs from '@/Store/MedicalCase/Drugs/AddAdditionalDrugs'
import ChangeDrugDuration from '@/Store/MedicalCase/Drugs/ChangeDrugDuration'

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
    AddAdditionalDrugs.action({
      diagnosisKey: 'agreed',
      diagnosisId,
      newAdditionalDrug: {
        id: drugId,
        duration: '',
      },
    }),
  )
  await store.dispatch(
    AddAdditionalDrugs.action({
      diagnosisKey: 'additional',
      diagnosisId,
      newAdditionalDrug: {
        id: drugId,
        duration: '',
      },
    }),
  )
})

describe('Handle additional drugs removal', () => {
  const diagnosisId = 60
  const drugId = 1679
  const duration = '7'

  it('should start with an agreed diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.agreed).includes(
        diagnosisId.toString(),
      ),
    ).toBe(true)
  })

  it('should start with additional drugs in an agreed diagnosis', () => {
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

  it('should remove an additional drug from an agreed diagnostic', async () => {
    store.dispatch(
      ChangeDrugDuration.action({
        drugKey: 'additional',
        diagnosisKey: 'agreed',
        diagnosisId,
        drugId,
        duration,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.agreed[diagnosisId].drugs
        .additional[drugId].duration,
    ).toBe(duration)
  })

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(diagnosisId.toString()),
    ).toBe(true)
  })

  it('should start with additional drugs in an additional diagnosis', () => {
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

  it('should remove an additional drug from an additional diagnostic', async () => {
    store.dispatch(
      ChangeDrugDuration.action({
        drugKey: 'additional',
        diagnosisKey: 'additional',
        diagnosisId,
        drugId,
        duration,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.additional[diagnosisId].drugs
        .additional[drugId].duration,
    ).toBe(duration)
  })
})
