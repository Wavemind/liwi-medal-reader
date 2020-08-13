// @flow
import filter from 'lodash/filter';
import find from 'lodash/find';
import { NodeModel } from './Node.model';

import { RequirementNodeModel } from './RequirementNodeModel';
import { InstanceModel } from './Instance.model';
import { valueFormats } from '../../constants';
import { calculateCondition } from '../../algorithm/conditionsHelpers.algo';
import { store } from '../../store';

interface QuestionsSequenceInterface {
  answer: string;
  answers: Object;
  description: string;
  label: string;
  dd: Array<Object>;
  ps: Array<Object>;
  nodes: Object;
}

export class QuestionsSequenceModel extends NodeModel implements QuestionsSequenceInterface {
  constructor(props) {
    super(props);

    const {
      answer = null,
      answers = {},
      description = '',
      label = '',
      dd = [],
      qs = [],
      conditions = {},
      instances = {},
      top_conditions = {},
      category = '',
      value_format = valueFormats.bool,
      min_score = 0,
    } = props;

    this.description = description;
    this.label = label;
    this.answer = answer;
    this.answers = answers;
    this.dd = dd;
    this.qs = qs;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.instances = instances;
    this.category = category;
    this.value_format = value_format;
    this.min_score = min_score;

    this.requirement = new RequirementNodeModel({ ...props });
    this.instanceLink();
  }

  instanceLink() {
    Object.keys(this.instances).map((id) => {
      this.instances[id] = new InstanceModel({ ...this.instances[id] });
    });
  }

  /**
   * Calculate condition of question sequence and these children
   */
  calculateCondition = (medicalCase) => {
    /**
     * Filter the top conditions
     *
     *  1. On Each top_condition
     *  2. Find the instance Id of the condition
     *  3. Check if the instance has the conditonValue to true
     *    If false the instance is closed (not answered or wrong answer)
     *  4. Return new array of top_condition
     */
    const top_conditions_with_condition_value_true = filter(this.top_conditions, (top_condition) => {
      const { conditionValue } = find(medicalCase.nodes[top_condition.first_node_id].qs, (qs) => {
        return qs.id === this.id;
      });
      if (conditionValue === true) {
        return true;
      }
    });

    const tempNodeFiltered = {
      ...this,
      top_conditions: top_conditions_with_condition_value_true,
    };

    return calculateCondition(tempNodeFiltered, medicalCase);
  };
}
