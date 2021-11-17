/**
 * The internal imports
 */
import { store } from '@/Store'
import { calculateConditionInverse } from '@/Utils/MedicalCase'

export default () => {
  const state = store.getState()
  const firstLookAssessmentOrder =
    state.algorithm.item.config.full_order.first_look_assessment_step
  const instances = state.algorithm.item.diagram.instances
  const mcNodes = state.medicalCase.item.nodes

  return firstLookAssessmentOrder.filter(nodeId =>
    calculateConditionInverse(instances[nodeId]?.conditions, mcNodes),
  )
}
