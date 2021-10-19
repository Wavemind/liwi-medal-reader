/**
 * The internal imports
 */
import { store } from '@/Store'

/**
 * Parse the formula and calculate it if all nodes needed is answered
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {null|any}
 */
export const calculateFormula = (nodeId, newNodes) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes

  // Regex to find the brackets [] in the formula
  const findBracketId = /\[(.*?)\]/gi
  const currentNode = nodes[nodeId]
  let ready = true

  // Function to change the [id] into the answered value
  const replaceBracketToValue = item => {
    // Get the id from the brackets []
    const id = item.match(/\d/g).join('')

    // Get value of node
    const mcNodeInBracket = newNodes[id]

    if (
      mcNodeInBracket.value === null ||
      (mcNodeInBracket.value === 0 && mcNodeInBracket.answer === null)
    ) {
      ready = false
      return null
    }

    return mcNodeInBracket.value
  }

  // Replace every bracket in the formula with it's value
  const formula = currentNode.formula.replace(
    findBracketId,
    replaceBracketToValue,
  )

  if (ready) {
    try {
      return eval(formula)
    } catch (error) {
      return null
    }
  }
  return null
}
