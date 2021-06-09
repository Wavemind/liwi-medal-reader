/**
 * The internal imports
 */
import { store } from '@/Store'

export default () => {
  const state = store.getState()
  return state.algorithm.item.config.full_order.registration_step
}
