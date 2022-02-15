import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'

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
    AddRefusedDrugs.action({
      diagnosisKey: 'agreed',
      diagnosisId,
      drugId,
    }),
  )
  await store.dispatch(
    AddRefusedDrugs.action({
      diagnosisKey: 'additional',
      diagnosisId,
      drugId,
    }),
  )
})

describe('Handle refused drugs removal', () => {
  const diagnosisId = 60
  const drugId = 1679

  it('should start with an agreed diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.agreed).includes(
        diagnosisId.toString(),
      ),
    ).toBe(true)
  })

  it('should start with refused drugs in an agreed diagnosis', () => {
    expect(
      store
        .getState()
        .medicalCase.item.diagnosis.agreed[diagnosisId].drugs.refused.includes(
          drugId,
        ),
    ).toBe(true)
  })

  it('should remove a refused drug from an agreed diagnostic', async () => {
    store.dispatch(
      RemoveRefusedDrugs.action({
        diagnosisKey: 'agreed',
        diagnosisId,
        drugId,
      }),
    )

    expect(
      store
        .getState()
        .medicalCase.item.diagnosis.agreed[diagnosisId].drugs.refused.includes(
          drugId,
        ),
    ).toBe(false)
  })

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(diagnosisId.toString()),
    ).toBe(true)
  })

  it('should start with refused drugs in an additional diagnosis', () => {
    expect(
      store
        .getState()
        .medicalCase.item.diagnosis.additional[
          diagnosisId
        ].drugs.refused.includes(drugId),
    ).toBe(true)
  })

  it('should remove a refused drug from an additional diagnostic', async () => {
    store.dispatch(
      RemoveRefusedDrugs.action({
        diagnosisKey: 'additional',
        diagnosisId,
        drugId,
      }),
    )

    expect(
      store
        .getState()
        .medicalCase.item.diagnosis.additional[
          diagnosisId
        ].drugs.refused.includes(drugId),
    ).toBe(false)
  })
})
