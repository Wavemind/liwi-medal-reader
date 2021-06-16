import { store } from '@/Store'
import Navigation from '@/Config/Navigation'

/**
 * Utility method to return the correct stages based on whether algorithm is_arm_control
 * @returns [Stages]
 */
export const getStages = () => {
  const isArmControl = store.getState().algorithm.item.is_arm_control
  const trackReferral = store.getState().algorithm.item.config.track_referral

  if (isArmControl) {
    if (trackReferral) {
      return Navigation.REFERRAL_ARM_CONTROL_STAGES
    }
    return Navigation.ARM_CONTROL_STAGES
  }

  if (trackReferral) {
    return Navigation.REFERRAL_INTERVENTION_STAGES
  }
  return Navigation.INTERVENTION_STAGES
}
