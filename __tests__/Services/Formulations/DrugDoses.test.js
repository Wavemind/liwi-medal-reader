/**
 * The external imports
 */
import 'react-native'

/**
 * The internal imports
 */
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import { store } from '@/Store'
import { drugDoses } from '@/Services/MedicalCase/DrugDoses'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const weightId = algorithm.config.basic_questions.weight_question_id
  await store.dispatch(SetAnswer.action({ nodeId: weightId, value: '3' }))
})

describe('Drug dose calculation', () => {
  it('should calculate doseResult of 3 for drugId = 1681, index = 1 and weight = 3', () => {
    const result = drugDoses(1, 1681)
    expect(result.doseResult).toEqual(3)
  })
  it('should calculate minDoseMl of 3 for drugId = 1681, index = 1 and weight = 3', () => {
    const result = drugDoses(1, 1681)
    expect(result.minDoseMl).toEqual(3)
  })
  it('should calculate doseResultMg of 75 for drugId = 1681, index = 1 and weight = 3', () => {
    const result = drugDoses(1, 1681)
    expect(result.doseResultMg).toEqual(75)
  })
  it('should calculate recurrence of 12 for drugId = 1681, index = 1 and weight = 3', () => {
    const result = drugDoses(1, 1681)
    expect(result.recurrence).toEqual(12)
  })
})
