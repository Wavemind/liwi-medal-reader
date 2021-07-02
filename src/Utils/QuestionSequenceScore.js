/**
 * The internal imports
 */
import { store } from '@/Store'

/**
 * Calculate score and question sequence scored status
 * @param qsId
 * @param newMcNodes
 * @returns {null|boolean}
 * @private
 */
export const scoredCalculateCondition = (qsId, newMcNodes) => {
  const algorithm = store.getState().algorithm.item

  const qs = algorithm.nodes[qsId]

  // If this is a top parent node
  if (qs.conditions.length === 0) {
    return true
  }

  let scoreTrue = 0
  let scoreFalse = 0
  let scoreNull = 0
  let scoreTotalPossible = 0

  qs.conditions.map(conditions => {
    const { answer_id, node_id } = conditions
    let returnedBoolean = false
    if (newMcNodes[node_id].answer !== null) {
      returnedBoolean = Number(newMcNodes[node_id].answer) === Number(answer_id)
    }
    scoreTotalPossible += conditions.score

    switch (returnedBoolean) {
      case true:
        scoreTrue += conditions.score
        break
      case false:
        scoreFalse += conditions.score
        break
      case null:
        scoreNull += conditions.score
        break
    }

    return returnedBoolean
  })

  // If score true so this QS is true
  if (scoreTrue >= qs.min_score) {
    return true
  }
  // If there are more false condition than min necessary so we return false
  if (scoreTotalPossible - scoreFalse <= qs.min_score) {
    return false
  }
  // If there are more null condition than min necessary so we return null
  if (scoreTotalPossible - scoreNull >= qs.min_score) {
    return null
  }
}
