/**
 * The internal imports
 */
import { store } from '@/Store'
import { calculateConditionInverse } from '@/Utils/MedicalCase'

export default () => {
  const state = store.getState()
  const referralOrder = state.algorithm.item.config.full_order.referral_step
  const instances = state.algorithm.item.diagram.instances
  const mcNodes = state.medicalCase.item.nodes

  return referralOrder.filter(nodeId =>
    calculateConditionInverse(instances[nodeId]?.conditions, mcNodes),
  )
}
