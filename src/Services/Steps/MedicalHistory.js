import isEqual from 'lodash/isEqual'
/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import {
  getValidDiagnoses,
  getTopConditions,
  handleChildren,
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

  const validDiagnoses = getValidDiagnoses()
  const currentSystems = state.questionsPerSystem.item.medicalHistory

  validDiagnoses.forEach(diagnosis => {
    const topConditions = getTopConditions(diagnosis.instances)

    handleChildren(
      topConditions,
      null,
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

  const updatedSystems = {}
  medicalHistoryStep.forEach(system => {
    const newQuestions = system.data.filter(questionId =>
      questionPerSystems[system.title]?.includes(questionId),
    )
    if (!isEqual(currentSystems[system.title], newQuestions)) {
      updatedSystems[system.title] = newQuestions
    }
  })

  updatedSystems.follow_up_questions = uniq(
    questionPerSystems.follow_up_questions,
  )

  return {
    ...state.questionsPerSystem.item,
    medicalHistory: {
      ...state.questionsPerSystem.item.medicalHistory,
      ...updatedSystems,
    },
  }
}
