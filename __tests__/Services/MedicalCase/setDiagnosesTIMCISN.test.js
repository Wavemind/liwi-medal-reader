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
import { SetDiagnosesService } from '@/Services/MedicalCase'
import { setBirthDate } from '../../Utils/BirthDate'
import { setAnswer } from '../../Utils/Answer'

beforeAll(async () => {
  const algorithmFile = require('../../version_41.json')
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
  await setBirthDate(store, 122, 'day')
  await setAnswer(9042, 7330) // I'm a male
  const weightId = algorithm.config.basic_questions.weight_question_id
  await setAnswer(weightId, '10')
})

describe('Final diagnosis are included / excluded correctly in TIMCI Senegale ', () => {
  it('Should be propose uncomplicated hernia', async () => {
    await setAnswer(9770, 8314) // Urine or genital problems
    await setAnswer(9439, 8069) // Groin or genital pain / swelling

    await setAnswer(9297, 7752) // Painful swelling of groin
    await setAnswer(9384, 7941) // Inguinal / femoral hernia

    await setAnswer(10049, 3252) // Hernia reducible

    const result = SetDiagnosesService()
    expect(result.diagnosis.proposed).toEqual(expect.arrayContaining([10047])) // Uncomplicated hernia
  })
})
