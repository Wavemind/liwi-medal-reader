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

beforeEach(async () => {
  const algorithm = store.getState().algorithm.item
  const diagnosis1Id = 76 // Severe croup
  const diagnosis2Id = 60 // Severe pneumonia
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
    // ManagementId = 1808 => Refer urgently for inpatient management
    // ManagementId = 1769 => No inpatient referral needed: Reasons to return to clinic
    const excludedManagements = ExtractExcludedManagementsService()
    expect(excludedManagements).toContain(1769)
  })
})
