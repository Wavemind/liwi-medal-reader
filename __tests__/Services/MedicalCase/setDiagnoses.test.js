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
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { store } from '@/Store'
import SetDiagnoses from '@/Services/MedicalCase/SetDiagnoses'
import { setBirthDate } from '../../Utils/BirthDate'
import { setAnswer } from '../../Utils/Answer'

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
  await setAnswer(214, 394) // I'm a male
})

describe('Final diagnosis are included / excluded correctly', () => {
  it('Basic test - should include uncomplicated lymphadenopathy most', async () => {
    await setAnswer(12, 20) // CC Ear / Throat / Mouth => Yes
    await setAnswer(203, 381) // Neck mass => Yes
    await setAnswer(1703, 764) // Duration of neck mass >= 4 weeks => No
    await setAnswer(204, 2) // Size of neck mass => < 3 cm
    await setAnswer(205, 386) // Local tenderness of neck mass => No
    const result = SetDiagnoses()
    expect(result.diagnosis.excluded).toEqual(expect.arrayContaining([208])) // Uncomplicated infectious lymphadenopathy
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([209])) // Uncomplicated lymphadenopathy
  })

  it('Checking complaint category - should not include uncomplicated lymphadenopathy because CC is not checked', async () => {
    await setAnswer(203, 381) // Neck mass => Yes
    await setAnswer(1703, 764) // Duration of neck mass >= 4 weeks => No
    await setAnswer(204, 2) // Size of neck mass => < 3 cm
    await setAnswer(205, 386) // Local tenderness of neck mass => No
    const result = SetDiagnoses()
    expect(result.diagnosis.excluded).toEqual(
      expect.arrayContaining([208, 209]), // Uncomplicated infectious lymphadenopathy & Uncomplicated lymphadenopathy
    )
  })

  it('Basic with QS - should include Severe pneumonia very basic diagram with QS', async () => {
    await setAnswer(39, 74) // Cough To Yes
    await setAnswer(40, 76) // Difficulty Breathing To Yes
    await setAnswer(2974, 2254) // Grunting To Yes
    await setAnswer(86, 145) // Unconscious To Yes
    const result = SetDiagnoses()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([60]))
  })

  it('Basic + Top level exclusion - should exclude Severe pneumonia very basic diagram exclusion at top level', async () => {
    await setAnswer(39, 75) // Cough To No
    await setAnswer(40, 77) // Difficulty Breathing To No
    const result = SetDiagnoses()
    expect(result.diagnosis.excluded).toEqual(expect.arrayContaining([60]))
  })

  it('One branch is true one is false /! Thrilling  + Top level exclusion - should include common cold', async () => {
    await setAnswer(39, 74) // Cough => Yes
    await setAnswer(40, 77) // Difficulty Breathing => No
    await setAnswer(1685, 752) // Convulsing now => No
    await setAnswer(88, 150) // Convulsion in present illness => No
    await setAnswer(86, 146) // Unconscious or Lethargic (Unusually sleepy) => No
    await setAnswer(3184, 2342) // Vomiting everything  => No
    await setAnswer(278, 491) // Unable to drink or breastfeed => No
    await setAnswer(199, 373) // Runny or blocked nose => No
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 60 }))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 83 }))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 116 }))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 123 }))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 3186 }))
    const result = SetDiagnoses()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([128]))
  })

  it('2 final diagnoses one included not the other - should include bacterial pneumonia + IMCI/IMAI pneumonia', async () => {
    await setAnswer(39, 74) // Cough => Yes
    await setAnswer(18, 26) // Chest indrawing  => YES
    await setAnswer(50, 39) // Axillary temperature   => > 38
    await setAnswer(1685, 752) // Convulsing now => No
    await setAnswer(88, 150) // Convulsion in present illness => No
    await setAnswer(86, 146) // Unconscious or Lethargic (Unusually sleepy) => No
    await setAnswer(3184, 2342) // Vomiting everything  => No
    await setAnswer(278, 491) // Unable to drink or breastfeed => No
    await setAnswer(122, 229) // CRP => Unavailable
    await setAnswer(3545, 55) // Respiratory rate => Unavailable
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 60 }))
    const result = SetDiagnoses()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([123, 83]))
  })

  it('Should not propose diagnosis that can be excluded', async () => {
    await setAnswer(39, 74) // Cough => Yes
    await setAnswer(18, 26) // Chest indrawing  => YES
    await setAnswer(50, 39) // Axillary temperature   => > 38
    await setAnswer(1685, 752) // Convulsing now => No
    await setAnswer(88, 150) // Convulsion in present illness => No
    await setAnswer(86, 146) // Unconscious or Lethargic (Unusually sleepy) => No
    await setAnswer(3184, 2342) // Vomiting everything  => No
    await setAnswer(278, 491) // Unable to drink or breastfeed => No
    await setAnswer(122, 229) // CRP => Unavailable
    let result = SetDiagnoses()
    expect(result.diagnosis.proposed).not.toEqual(expect.arrayContaining([116]))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 60 }))
    result = SetDiagnoses()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([83]))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 83 }))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 123 }))
    result = SetDiagnoses()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([116]))
  })

  it('Should not propose excluded final diagnosis in we agree excluding final diagnosis', async () => {
    const nodes = store.getState().algorithm.item.nodes
    await setAnswer(39, 74) // Cough => Yes
    await setAnswer(18, 26) // Chest indrawing  => YES
    await setAnswer(50, 39) // Axillary temperature   => > 38
    await setAnswer(1685, 752) // Convulsing now => No
    await setAnswer(88, 150) // Convulsion in present illness => No
    await setAnswer(86, 146) // Unconscious or Lethargic (Unusually sleepy) => No
    await setAnswer(3184, 2342) // Vomiting everything  => No
    await setAnswer(278, 491) // Unable to drink or breastfeed => No
    await setAnswer(122, 229) // CRP => Unavailable
    let result = SetDiagnoses()
    expect(result.diagnosis.proposed).not.toEqual(expect.arrayContaining([116]))
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 60 }))
    result = SetDiagnoses()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([83]))
    store.dispatch(
      AddAgreedDiagnoses.action({
        diagnosisId: 83,
        diagnosisContent: {
          id: 83,
          managements: Object.values(nodes[83].managements).map(
            management => management.id,
          ),
          drugs: {
            proposed: Object.values(nodes[83].drugs).map(drug => drug.id),
            agreed: {},
            refused: [],
            additional: {},
          },
        },
      }),
    )
    store.dispatch(AddRefusedDiagnoses.action({ diagnosisId: 123 }))
    result = SetDiagnoses()
    expect(result.diagnosis.excluded).toEqual(expect.arrayContaining([116]))
  })

  it('Reference table - should include complicated severe acute malnutrition', async () => {
    await setAnswer(97, 23) // CRP => Unavailable
    const result = SetDiagnoses()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([3804]))
  })
})
