/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'

export default () => {
  const nodes = store.getState().algorithm.item.nodes
  const questionsToDisplay = []

  Object.values(nodes)
    .filter(node => node.category === Config.CATEGORIES.assessment)
    .forEach(node => questionsToDisplay.push(node.id))
  return questionsToDisplay
}
