import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'
import ChangeCustomDrugDuration from '@/Store/MedicalCase/Drugs/ChangeCustomDrugDuration'

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
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
  const duration = '7'

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
        store.getState().medicalCase.item.diagnosis.custom[diagnosisId].drugs,
      ).includes(drugId),
    ).toBe(true)
  })

  it('should modify the duration for a custom drug', async () => {
    store.dispatch(
      ChangeCustomDrugDuration.action({
        diagnosisId,
        drugId,
        duration,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.custom[diagnosisId].drugs[
        drugId
      ].duration,
    ).toBe(duration)
  })
})
