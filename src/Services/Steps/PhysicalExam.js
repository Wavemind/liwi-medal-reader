/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import {
  getValidDiagnoses,
  getTopConditions,
  handleChildren,
  orderSystems,
  uniq,
} from '@/Utils/MedicalCase'

export default () => {
  const questionPerSystems = {}
  const state = store.getState()
  const physicalExamCategories = [
    Config.CATEGORIES.physicalExam,
    Config.CATEGORIES.backgroundCalculation,
    Config.CATEGORIES.vitalSignAnthropometric,
  ]
  const physicalExamStep =
    state.algorithm.item.config.full_order.physical_exam_step

  const validDiagnoses = getValidDiagnoses()

  validDiagnoses.forEach(diagnosis => {
    const topConditions = getTopConditions(diagnosis.instances)

    handleChildren(
      topConditions,
      null,
      questionPerSystems,
      diagnosis.instances,
      physicalExamCategories,
      diagnosis.id,
    )
  })

  Object.keys(questionPerSystems).map(k => {
    questionPerSystems[k] = uniq(questionPerSystems[k])
  })

  return orderSystems(physicalExamStep, questionPerSystems)
}
