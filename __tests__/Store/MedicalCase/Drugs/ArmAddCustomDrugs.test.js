import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import ArmAddCustomDrugs from '@/Store/MedicalCase/ArmControl/ArmAddCustomDrugs'

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

  await store.dispatch(
    AddAdditionalDiagnoses.action({
      newAdditionalDiagnoses: {
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
            custom: {},
          },
        },
      },
    }),
  )
})

describe('Handle custom drugs addition for Arm Control', () => {
  const diagnosisId = 60
  const drugId = 1679

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(diagnosisId.toString()),
    ).toBe(true)
  })

  it('should add custom drugs to an additional diagnostic', async () => {
    store.dispatch(
      ArmAddCustomDrugs.action({
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
      store.getState().medicalCase.item.diagnosis.additional[diagnosisId].drugs
        .custom,
    ).toStrictEqual({
      1679: {
        id: 1679,
        name: 'Alcohol',
        duration: '',
      },
    })
  })
})
