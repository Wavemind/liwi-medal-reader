import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import ChangeFormulations from "@/Store/MedicalCase/ChangeFormulations";

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const diagnosisId = 3299
  const drugId = 1681
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
    AddAgreedDrugs.action({
      diagnosisKey: 'agreed',
      diagnosisId,
      drugId,
    }),
  )
})

describe('Handle drug formulation modification', () => {
  const diagnosisId = 3299
  const drugId = 1681
  const formulationId = 4

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

  it('should update the selected formulation for the drug', async () => {
    store.dispatch(
      ChangeFormulations.action({
        diagnosisKey: 'agreed',
        diagnosisId,
        drugKey: 'agreed',
        drugId,
        formulationId,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.agreed[diagnosisId].drugs.agreed[drugId].formulation_id).toEqual(4)
  })
})
