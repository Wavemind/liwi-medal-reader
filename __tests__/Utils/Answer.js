import SetAnswer from '@/Store/MedicalCase/SetAnswer'

import { store } from '@/Store'
/**
 * Set a an answer for a node
 * @param {store} store : Id if the node
 * @param {*} value : the value you want to set
 */
export const setAnswer = async (nodeId, value) => {
  await store.dispatch(SetAnswer.action({ nodeId, value }))
}
