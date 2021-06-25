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
  ]
  const questionPerSystems = {}
  const medicalHistoryStep =
    state.algorithm.item.config.full_order.medical_history_step

  // TODO Comment on affiche les vital Signs / Background calculation

  const validDiagnoses = getValidDiagnoses()
  const currentSystems = state.questionsPerSystem.item.medicalHistory

  validDiagnoses.forEach(diagnosis => {
    const topConditions = getTopConditions(diagnosis.instances)

    handleChildren(
      topConditions,
      questionPerSystems,
      diagnosis.instances,
      medicalHistoryCategories,
      diagnosis.id,
      Config.NODE_TYPES.diagnosis,
      true,
      currentSystems,
      medicalHistoryStep,
    )
  })

  Object.keys(questionPerSystems).map(k => {
    questionPerSystems[k] = uniq(questionPerSystems[k])
  })

  return {
    ...state.questionsPerSystem.item,
    medicalHistory: orderSystems(medicalHistoryStep, questionPerSystems),
  }
}
