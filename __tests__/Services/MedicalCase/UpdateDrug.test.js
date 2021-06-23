/**
 * The external imports
 */
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import CreatePatient from '@/Store/Patient/Create'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import UpdateDrugs from '@/Services/MedicalCase/UpdateDrug'
import { store } from '@/Store'
import { setBirthDate } from '../../Utils/BirthDate'
import { setAnswer } from '../../Utils/Answer'
import { agreeFinalDiagnosis } from '../../Utils/FinalDiagnosis'
import { getAvailableDrugs } from '@/Utils/Drug'

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
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
  const uid = uuid.v4()
  await store.dispatch(
    CreatePatient.action({
      facility: {
        uid,
        study_id: 'Test Study',
        group_id: 7,
      },
      otherFacility: {},
    }),
  )
  await setBirthDate(store, 7, 'year')
})

describe('Test Drugs Exclusion', () => {
  it('should exclude a drug when an excluding drug is agreed', async () => {
    const state = store.getState()
    const algorithm = state.algorithm.item
    const pharyngitisId = 192
    const pharyngitis = algorithm.nodes[pharyngitisId]

    // Treatment Condition
    await setAnswer(2103, 925)

    // Add Bacterial acute pharyngitis
    agreeFinalDiagnosis(pharyngitisId, pharyngitis)

    expect(getAvailableDrugs(pharyngitis)).toEqual(
      expect.arrayContaining([1681]),
    )

    // Treatment Condition
    await setAnswer(2253, 1171)
    await setAnswer(2251, 1166)

    // Agree pyelonephritis
    const pyelonephritisId = 257
    const pyelonephritis = algorithm.nodes[pyelonephritisId]
    agreeFinalDiagnosis(pyelonephritisId, pharyngitis)

    expect(getAvailableDrugs(pyelonephritis)).toEqual(
      expect.arrayContaining([1682]),
    )
    expect(getAvailableDrugs(pharyngitis)).toEqual(
      expect.arrayContaining([1681]),
    )
    await UpdateDrugs(257, 1682, true, 'agreed')

    expect(getAvailableDrugs(pyelonephritis)).toEqual(
      expect.arrayContaining([1682]),
    )
    expect(getAvailableDrugs(pharyngitis)).not.toEqual(
      expect.arrayContaining([1681]),
    )
    expect(getAvailableDrugs(pharyngitis)).toEqual(
      expect.arrayContaining([1660]),
    )
  })

  it('should reset the drug once it is not proposed anymore', async () => {
    const state = store.getState()
    const algorithm = state.algorithm.item
    const pharyngitisId = 192
    const pharyngitis = algorithm.nodes[pharyngitisId]
    const pyelonephritisId = 257
    const pyelonephritis = algorithm.nodes[pyelonephritisId]
    // Agree final Diagnoses
    agreeFinalDiagnosis(pyelonephritisId, pharyngitis)
    agreeFinalDiagnosis(pharyngitisId, pyelonephritis)

    // Treatment Condition
    await setAnswer(2103, 925)
    await setAnswer(2253, 1171)
    await setAnswer(2251, 1166)

    expect(getAvailableDrugs(pyelonephritis)).toEqual(
      expect.arrayContaining([1682]),
    )
    expect(getAvailableDrugs(pharyngitis)).toEqual(
      expect.arrayContaining([1681]),
    )
    await setAnswer(2251, 1167)
    expect(getAvailableDrugs(pyelonephritis)).not.toEqual(
      expect.arrayContaining([1682]),
    )
    await UpdateDrugs(257, 1682, true, 'agreed')
    const drugAgreed =
      store.getState().medicalCase.item.diagnosis.agreed[pyelonephritis.id]
        .drugs.agreed

    expect(Object.values(drugAgreed).map(d => d.id)).not.toEqual(
      expect.arrayContaining([1682]),
    )
  })
})
