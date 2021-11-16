/**
 * The internal imports
 */
import { store } from '@/Store'
import { calculateConditionInverse } from '@/Utils/MedicalCase'

export default () => {
  const state = store.getState()
  const instances = state.algorithm.item.diagram.instances
  const mcNodes = state.medicalCases.item.nodes
  return state.algorithm.item.config.full_order.first_look_assessment_step.filter(
    nodeId => calculateConditionInverse(instances[nodeId].conditions, mcNodes),
  )
}
