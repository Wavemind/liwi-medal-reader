// @flow

import { QuestionsSequenceModel } from './QuestionsSequenceModel';
import { comparingTopConditions } from '../../algorithm/algoConditionsHelpers';

export class QuestionsSequenceScoredModel extends QuestionsSequenceModel {
  constructor(props) {
    super(props);
  }

  calculateCondition = () => {

    // If this is a top parent node
    if (this.top_conditions.length === 0) {
      return true;
    }

    let scoreTrue = 0;
    let scoreFalse = 0;
    let scoreNull = 0;
    let scoreTotalPossible = 0;

    // Loop for top_conditions
    this.top_conditions.map((conditions) => {
      let returnedBoolean = comparingTopConditions(this, conditions);

      scoreTotalPossible = scoreTotalPossible + conditions.score;
      switch (returnedBoolean) {
        case true:
          scoreTrue = scoreTrue + conditions.score;
          break;
        case false:
          scoreFalse = scoreFalse + conditions.score;
          break;
        case null:
          scoreNull = scoreNull + conditions.score;
          break;
      }

      return returnedBoolean;
    });

    // If score true so this QS is true
    if (scoreTrue >= this.min_score) return true;
    // If there are more false condition than min necessary so we return false
    if (scoreTotalPossible - scoreFalse >= this.min_score) return false;
    // If there are more null condition than min necessary so we return null
    if (scoreTotalPossible - scoreNull >= this.min_score) return null;
  };
}
