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
import setAnswer from '@/Utils/SetAnswer'

import { setBirthDate } from '../../Utils/BirthDate'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
  await setBirthDate(store, 4, 'year')

  const weightId = algorithm.config.basic_questions.weight_question_id
  await setAnswer(weightId, '10')
})

describe('Drug dose calculation', () => {
  it('should calculate doseResult of 1 for drugId = 1681 (amoxicilin po), formulation is syrup and weight is 10kg', () => {
    const result = drugDoses(1, 1681)
    expect(result.doseResult).toEqual(10)
  })
  it('should calculate minDoseMl of 1 for drugId = 1681 (amoxicilin po), formulation is syrup and weight is 10kg', () => {
    const result = drugDoses(1, 1681)
    expect(result.minDoseMl).toEqual(10)
  })
  it('should calculate doseResultMg of 250 for drugId = 1681 (amoxicilin po), formulation is syrup and weight is 10kg', () => {
    const result = drugDoses(1, 1681)
    expect(result.doseResultMg).toEqual(250)
  })
  it('should calculate recurrence of 12 for drugId = 1681 (amoxicilin po), formulation is syrup and weight is 10kg', () => {
    const result = drugDoses(1, 1681)
    expect(result.recurrence).toEqual(12)
  })
  it('should calculate recurrence of 12 for drugId = 1681 (amoxicilin po), formulation is capsule and weight is 10kg', () => {
    const result = drugDoses(2, 1681)
    expect(result.recurrence).toEqual(12)
  })
  it('should calculate minDoseMg of 125 for drugId = 1681 (amoxicilin po), formulation is capsule and weight is 10kg', () => {
    const result = drugDoses(2, 1681)
    expect(result.minDoseMg).toEqual(125)
  })
  it('should calculate doseResult of 1 for drugId = 1681 (amoxicilin po), formulation is capsule and weight is 10kg', () => {
    const result = drugDoses(2, 1681)
    expect(result.doseResult).toEqual(1)
  })
  it('should calculate minDoseCap of 0.6 for drugId = 1681 (amoxicilin po), formulation is capsule and weight is 10kg', () => {
    const result = drugDoses(2, 1681)
    expect(result.recurrence).toEqual(12)
  })
})
