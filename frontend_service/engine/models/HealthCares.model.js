// @flow

import { NodeModel } from './Node.model';
import { nodesType } from '../../constants';
import { store } from '../../store';

interface HealthCaresInterface {}

export class HealthCaresModel extends NodeModel implements HealthCaresInterface {
  constructor(props) {
    super(props);

    const { description = '', label = '' } = props;

    this.description = description;
    this.label = label;
  }

  getQuestions(instanceHealthcare) {
    const state$ = store.getState();
    let questions = {};
    instanceHealthcare.top_conditions.map((tp) => {
      let node = state$.nodes[tp.first_node_id];
      if (node.type === nodesType.questionsSequence) {
        if (node.answer === null) {
          Object.keys(node.instances).map((d) => (questions[d] = state$.nodes[d]));
        }
      } else {
        questions[tp.first_node_id] = node;
      }
    });
    return questions;
  }
}
