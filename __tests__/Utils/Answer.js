import { setAnswer as UtilsSetAnswer } from '@/Utils/Answers'

/**
 * Set a an answer for a node
 * @param {store} store : Id if the node
 * @param {*} value : the value you want to set
 */
export const setAnswer = async (nodeId, value) => {
  await UtilsSetAnswer(nodeId, value)
}
