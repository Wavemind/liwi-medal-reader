import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const nodeId = '60'
  await store.dispatch(
    AddCustomDiagnoses.action({
      diagnosisId: nodeId,
      diagnosisContent: {
        id: nodeId,
        name: 'COVID',
        drugs: {},
      },
    }),
  )
})

describe('Handle custom drugs addition', () => {
  const diagnosisId = '60'
  const drugId = '1679'

  it('should start with a custom diagnosis', () => {
    expect(
      Object.keys(store.getState().medicalCase.item.diagnosis.custom).includes(
        diagnosisId,
      ),
    ).toBe(true)
  })

  it('should add custom drugs to a custom diagnostic', async () => {
    store.dispatch(
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

    expect(
      store.getState().medicalCase.item.diagnosis.custom[diagnosisId].drugs,
    ).toStrictEqual({
      '1679': {
        id: '1679',
        name: 'Alcohol',
        duration: '',
      },
    })
  })
})
