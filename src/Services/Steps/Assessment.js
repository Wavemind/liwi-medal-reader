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
} from '@/Utils/MedicalCase'

export default () => {
  const state = store.getState()
  const assessmentCategories = [Config.CATEGORIES.assessment]
  const assessmentStep = state.algorithm.item.config.full_order.assessments_step

  const validDiagnoses = getValidDiagnoses()
  const questionsToDisplay = []

  validDiagnoses.forEach(diagnosis => {
    const topConditions = getTopConditions(diagnosis.instances)

    handleChildren(
      topConditions,
      questionsToDisplay,
      diagnosis.instances,
      assessmentCategories,
      diagnosis.id,
      false,
    )
  })

  return assessmentStep.filter(question => {
    questionsToDisplay.includes(question)
  })
}
