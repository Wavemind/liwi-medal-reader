import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'
import RemoveCustomDrugs from '@/Store/MedicalCase/Drugs/RemoveCustomDrugs'

beforeAll(async () => {
  const algorithmFile = require('../../../version_1.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const diagnosisId = '60'
  const drugId = '1679'
  await store.dispatch(
    AddCustomDiagnoses.action({
      diagnosisId: diagnosisId,
      diagnosisContent: {
        id: diagnosisId,
        name: 'COVID',
        drugs: {},
      },
    }),
  )
  await store.dispatch(
    AddCustomDrugs.action({
      diagnosisKey: 'custom',
      diagnosisId,
      drugId,
      drugContent: {
        id: drugId,
        name: 'Alcohol',
        duration: '',
      },
    }),
  )
})

describe('Handle custom drugs removal', () => {
  const diagnosisId = '60'
  const drugId = '1679'

  it('should start with a custom diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.custom).includes(
        diagnosisId,
      ),
    ).toBe(true)
  })

  it('should start with a custom drug', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.custom[diagnosisId].drugs
          .custom,
      ).includes(drugId),
    ).toBe(true)
  })

  it('should remove custom drugs from a custom diagnostic', async () => {
    store.dispatch(
      RemoveCustomDrugs.action({
        diagnosisKey: 'custom',
        diagnosisId,
        drugId,
      }),
    )

    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.custom[diagnosisId].drugs
          .custom,
      ).includes(drugId.toString()),
    ).toBe(false)
  })
})
