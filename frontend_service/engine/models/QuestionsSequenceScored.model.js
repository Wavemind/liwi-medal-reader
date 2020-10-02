// @flow

import { QuestionsSequenceModel } from './QuestionsSequenceModel';
import { comparingTopConditions } from '../../algorithm/conditionsHelpers.algo';

export class QuestionsSequenceScoredModel extends QuestionsSequenceModel {
  /**
   * Calculate condition by answer scored
   * Sum answer scored and comparing it to the questions sequence scored
   */
  calculateCondition = (algorithm, medicalCase) => {
    const currentNode = algorithm.nodes[this.id];

    // If this is a top parent node
    if (currentNode.top_conditions.length === 0) {
      return true;
    }

    let scoreTrue = 0;
    let scoreFalse = 0;
    let scoreNull = 0;
    let scoreTotalPossible = 0;

    // Loop for top_conditions
    currentNode.top_conditions.map((conditions) => {
      const returnedBoolean = comparingTopConditions(conditions, medicalCase);

      scoreTotalPossible += conditions.score;
      switch (returnedBoolean) {
        case true:
          scoreTrue += conditions.score;
          break;
        case false:
          scoreFalse += conditions.score;
          break;
        case null:
          scoreNull += conditions.score;
          break;
      }

      return returnedBoolean;
    });

    // If score true so this QS is true
    if (scoreTrue >= currentNode.min_score) return true;
    // If there are more false condition than min necessary so we return false
    if (scoreTotalPossible - scoreFalse >= currentNode.min_score) return false;
    // If there are more null condition than min necessary so we return null
    if (scoreTotalPossible - scoreNull >= currentNode.min_score) return null;
  };
}
