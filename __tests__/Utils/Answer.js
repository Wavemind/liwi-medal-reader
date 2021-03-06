import { default as UtilsSetAnswer } from '@/Utils/SetAnswer'

/**
 * Set a an answer for a node
 * @param {store} store : Id if the node
 * @param {*} value : the value you want to set
 */
export const setAnswer = async (nodeId, value) => {
  await UtilsSetAnswer(nodeId, value)
}
