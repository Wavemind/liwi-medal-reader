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
  calculateConditionInverse,
  uniq,
} from '@/Utils/MedicalCase'

export default () => {
  const questionPerSystems = {}
  const state = store.getState()
  const physicalExamCategories = [
    Config.CATEGORIES.physicalExam,
    Config.CATEGORIES.vitalSignAnthropometric,
  ]
  const physicalExamStep =
    state.algorithm.item.config.full_order.physical_exam_step
  const currentSystems = state.questionsPerSystem.item.physicalExam
  const instances = state.algorithm.item.diagram.instances

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
      Config.NODE_TYPES.diagnosis,
      true,
      currentSystems,
      physicalExamStep,
    )
  })

  const mcNodes = store.getState().medicalCase.item.nodes
  const updatedSystems = {}
  physicalExamStep.forEach(system => {
    const newQuestions = system.data.filter(
      questionId =>
        questionPerSystems[system.title]?.includes(questionId) &&
        calculateConditionInverse(instances[questionId]?.conditions, mcNodes),
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
    physicalExam: {
      ...state.questionsPerSystem.item.physicalExam,
      ...updatedSystems,
    },
  }
}
