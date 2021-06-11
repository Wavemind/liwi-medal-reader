/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import {
  getValidDiagnostics,
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
  const diagnostics = state.algorithm.item.diagnostics
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes
  const questionPerSystems = {}
  const medicalHistoryStep =
    state.algorithm.item.config.full_order.medical_history_step

  const validDiagnostics = getValidDiagnostics(diagnostics, mcNodes, nodes)

  // console.log('validDiagnostics', validDiagnostics)
  // console.log('nodes', nodes)

  validDiagnostics.forEach(diagnostic => {
    const topConditions = getTopConditions(diagnostic.instances)

    handleChildren(
      topConditions,
      questionPerSystems,
      nodes,
      diagnostic,
      medicalHistoryCategories,
    )
  })
  Object.keys(questionPerSystems).map(k => {
    questionPerSystems[k] = uniq(questionPerSystems[k])
  })
  // console.log('systems', questionPerSystems)
  // console.log('medicalHistoryStep', medicalHistoryStep)

  return orderSystems(medicalHistoryStep, questionPerSystems)
}
