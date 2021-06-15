/**
 * The external imports
 */

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
  const state = store.getState()
  const medicalHistoryCategories = [
    Config.CATEGORIES.symptom,
    Config.CATEGORIES.exposure,
    Config.CATEGORIES.chronicCondition,
    Config.CATEGORIES.symptom,
    Config.CATEGORIES.vaccine,
    Config.CATEGORIES.observedPhysicalSign,
    //Config.CATEGORIES.backgroundCalculation,
  ]
  const nodes = state.algorithm.item.nodes
  const questionPerSystems = {}
  const medicalHistoryStep =
    state.algorithm.item.config.full_order.medical_history_step

  const validDiagnoses = getValidDiagnoses()

  validDiagnoses.forEach(diagnosis => {
    const topConditions = getTopConditions(diagnosis.instances)

    handleChildren(
      topConditions,
      questionPerSystems,
      nodes,
      diagnosis.instances,
      medicalHistoryCategories,
      diagnosis.id,
    )
  })
  Object.keys(questionPerSystems).map(k => {
    questionPerSystems[k] = uniq(questionPerSystems[k])
  })

  return orderSystems(medicalHistoryStep, questionPerSystems)
}
