// @flow
import filter from 'lodash/filter';
import find from 'lodash/find';
import { NodeModel } from './Node.model';

import { calculateCondition } from '../../algorithm/conditionsHelpers.algo';

export class QuestionsSequenceModel extends NodeModel {
  constructor(props) {
    super(props);
    const { answer = null, dd = [], qs = [], df = [] } = props;

    this.answer = answer;
    this.dd = dd;
    this.qs = qs;
    this.df = df;
  }

  /**
   * Calculate condition of question sequence and these children
   */
  // TODO CLEAN THIS SHIT !
  calculateCondition = (algorithm, medicalCase) => {
    const currentNode = algorithm.nodes[this.id];
    /**
     * Filter the top conditions
     *
     *  1. On Each top_condition
     *  2. Find the instance Id of the condition
     *  3. Check if the instance has the conditionValue to true
     *    If false the instance is closed (not answered or wrong answer)
     *  4. Return new array of top_condition
     */
    const topConditionsWithConditionValueTrue = filter(currentNode.top_conditions, (top_condition) => {
      const { conditionValue } = find(medicalCase.nodes[top_condition.first_node_id].qs, (qs) => {
        return qs.id === this.id;
      });
      return conditionValue;
    });

    const tempNodeFiltered = {
      ...this,
      top_conditions: topConditionsWithConditionValueTrue,
    };

    return calculateCondition(algorithm, tempNodeFiltered, medicalCase);
  };
}
