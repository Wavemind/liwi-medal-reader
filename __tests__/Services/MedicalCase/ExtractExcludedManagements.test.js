/**
 * The internal imports
 */
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import { store } from '@/Store'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { ExtractExcludedManagementsService } from '@/Services/MedicalCase'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
})

// 1769 => 76
// 1808 => 60

beforeEach(async () => {
  const algorithm = store.getState().algorithm.item
  const diagnosis1Id = 76
  const diagnosis2Id = 60
  const currentNode1 = algorithm.nodes[diagnosis1Id]
  const currentNode2 = algorithm.nodes[diagnosis2Id]

  await store.dispatch(CreateMedicalCase.action({ algorithm }))
  await store.dispatch(
    AddAgreedDiagnoses.action({
      diagnosisId: diagnosis1Id,
      diagnosisContent: {
        id: diagnosis1Id,
        managements: Object.values(currentNode1.managements).map(
          management => management.id,
        ),
        drugs: {
          proposed: [],
          agreed: {},
          refused: [],
          additional: {},
        },
      },
    }),
  )
  await store.dispatch(
    AddAgreedDiagnoses.action({
      diagnosisId: diagnosis2Id,
      diagnosisContent: {
        id: diagnosis2Id,
        managements: Object.values(currentNode2.managements).map(
          management => management.id,
        ),
        drugs: {
          proposed: [],
          agreed: {},
          refused: [],
          additional: {},
        },
      },
    }),
  )
})

describe('Extract excluded managements', () => {
  it('Should exclude managementId 1769 when managementId 1808 is present', () => {
    const excludedManagements = ExtractExcludedManagementsService()
    expect(excludedManagements).toContain(1769)
  })
})
