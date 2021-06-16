import { store } from '@/Store'
import Navigation from '@/Config/Navigation'

/**
 * Utility method to return the correct stages based on whether algorithm is_arm_control
 * @returns [Stages]
 */
export const getStages = () => {
  const is_arm_control = store.getState().algorithm.item.is_arm_control

  if (is_arm_control) {
    return Navigation.ARM_CONTROL_STAGES
  }
  return Navigation.INTERVENTION_STAGES
}
