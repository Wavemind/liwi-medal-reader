/**
 * The internal imports
 */
import { store } from '@/Store'
import { calculateConditionInverse } from '@/Utils/MedicalCase'

export default () => {
  const state = store.getState()
  const registrationOrder =
    state.algorithm.item.config.full_order.registration_step
  const instances = state.algorithm.item.diagram.instances
  const mcNodes = state.medicalCase.item.nodes

  return registrationOrder.filter(nodeId =>
    // Skip first name, last name and birth date
    calculateConditionInverse(instances[nodeId]?.conditions, mcNodes),
  )
}
