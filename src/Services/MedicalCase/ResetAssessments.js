/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import { setNodeValue } from '@/Utils/Answers'

export default props => {
  let newValues = {}

  const {
    algorithm: {
      item: { nodes },
    },
    medicalCase: { item: newMedicalCase },
  } = store.getState()
  // TODO find another way
  let newNodes = JSON.parse(JSON.stringify(newMedicalCase.nodes))

  Object.values(nodes)
    .filter(node => node.category === Config.CATEGORIES.assessment)
    .forEach(node => {
      const mcNode = newNodes[node.id]
      // Set the new value to the current node
      newValues = setNodeValue(mcNode, node, null)

      newNodes[node.id] = {
        ...mcNode,
        ...newValues,
      }
    })
  return {
    ...newMedicalCase,
    activities: [],
    nodes: {
      ...newNodes,
    },
  }
}
