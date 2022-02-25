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
import { store } from '@/Store'
import { setBirthDate } from '../../Utils/BirthDate'
import { setAnswer } from '../../Utils/Answer'
import { SetDiagnosesService } from '@/Services/MedicalCase'

beforeAll(async () => {
  const algorithmFile = require('../../version_34.json')
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
  await setBirthDate(store, 740)
  await setAnswer(5139, 3363) // I'm a male
})

describe('Final diagnosis are included / excluded correctly in Timci Tanzania ', () => {
  it('Testing question sequence behaviour', async () => {
    await setAnswer(5805, 4685) // CC Fever
    await setAnswer(5533, 4056) // Fever last 2 days => yes
    await setAnswer(6083, 4835) // Convulsing now  => No
    await setAnswer(5185, 3447) // Unconscious or Lethargic => No
    await setAnswer(6082, 4833) // Convulsions in present illness => No
    await setAnswer(5564, 4126) // "Malaria rapid diagnostic test ==> Negative

    const state = store.getState()

    expect(state.medicalCase.item.nodes[6148].answer).toEqual(4968)
  })

  // DOESN'T WORK
  // it('Should propose Pathologic-severe jaundice final diagnostic', async () => {
  //   await setBirthDate(store, 10, 'day')

  //   await setAnswer(5385, 3764) // Yellow appearing skin or eyes (jaundice)
  //   await setAnswer(6169, 5009) // High risk from prematurity

  //   const result = SetDiagnosesService()
  //   expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([6458]))
  // })

  // DOESN'T WORK
  // it('Should propose Mastoiditis', async () => {
  //   const algorithm = store.getState().algorithm.item
  //   const weightId = algorithm.config.basic_questions.weight_question_id
  //   await setBirthDate(store, 25, 'month')
  //   await setAnswer(weightId, '9') // Weight

  //   await setAnswer(22727, 2685) // Type of consultation -> First visit
  //   await setAnswer(10460, 8681) // Emergency question -> No
  //   await setAnswer(5797, 4668) // CC ENT -> Yes
  //   await setAnswer(5553, '39') // Ax temp (BM) -> 39
  //   await setAnswer(5140, 5274) // Height -> Not feasible
  //   await setAnswer(5136, 5273) // MUAC -> Default value

  //   await setAnswer(6083, 4835) // Convulsing now -> No
  //   await setAnswer(22730, 26835) // Unconscious -> No
  //   await setAnswer(5602, 4217) // Lethargic -> No
  //   await setAnswer(5751, 4572) // Vomiting everything -> No
  //   await setAnswer(5533, 4056) // Fever whithin the last 2 days -> Yes
  //   await setAnswer(5545, '3') // Duration of fever -> 3
  //   await setAnswer(5543, 4077) // Cough -> No
  //   await setAnswer(5544, 4079) // Difficulty breathing -> No
  //   await setAnswer(6108, 4874) // Ear problem -> Yes
  //   await setAnswer(5572, 4152) // Suspicion of foreign body in ear -> No
  //   await setAnswer(5394, 3786) // Mouth or theeth problem -> No
  //   await setAnswer(5515, 4016) // Sore throat -> No
  //   await setAnswer(5580, 4171) // Neck mass/Lump -> No
  //   await setAnswer(5668, 4372) // Cheek swelling -> No
  //   await setAnswer(5402, 3802) // Loose or liquid stools -> No
  //   await setAnswer(5601, 4215) // Vomiting -> No
  //   await setAnswer(5546, 4085) // Recent close contact with sb with TB -> No
  //   await setAnswer(5250, 3547) // HIV status of child -> Negative
  //   await setAnswer(5174, 3428) // Chronic condition -> No
  //   await setAnswer(5579, 4169) // Runny or blocked nose -> No
  //   await setAnswer(6124, 4913) // Palmar pallor -> Absent
  //   await setAnswer(5472, 3950) // Conjunctival pallor -> Absent
  //   await setAnswer(5761, 4592) // Jaundice -> Absent
  //   await setAnswer(6113, 6885) // Oxygen saturation -> Not feasible
  //   await setAnswer(5574, 455) // Tender swelling behind the ear -> Present
  //   await setAnswer(6119, 4903) // Stiff neck -> Absent
  //   await setAnswer(6128, 4922) // identifiable source of fever -> No
  //   await setAnswer(6134, 4936) // Hemoglobin -> Test not available
  //   await setAnswer(5564, 4126) // Malaria rapid diagnostic test -> Negative
  //   await setAnswer(5822, 8711) // Additionnal test  -> None needed

  //   const result = SetDiagnosesService()
  //   expect(result.diagnosis.proposed).toEqual(
  //     expect.arrayContaining([6206, 6259]),
  //   ) // Moderate malnutrition, Mastoiditis
  // })
})
