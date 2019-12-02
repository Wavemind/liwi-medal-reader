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

  /**
   * Recursif call to get question in QS from QS
   * Immutability set on questions[key]
   */
  getRecursifQuestionsInQs = (state$, questions, node) => {
    Object.keys(node.instances).map((d) => {
      if (state$.nodes[d].type === nodesType.questionsSequence) {
        this.getRecursifQuestionsInQs(state$, questions, state$.nodes[d]);
      } else {
        questions[d] = state$.nodes[d];
      }
    });
  };

  /**
   *  Get questions related to a healthcare
   *  Recursif call to include question in Qs
   *  Immutability set on questions[key]
   */
  getQuestions(instanceHealthcare) {
    const state$ = store.getState();
    let questions = {};
    instanceHealthcare.top_conditions.map((tp) => {
      let node = state$.nodes[tp.first_node_id];
      if (node.type === nodesType.questionsSequence) {
        this.getRecursifQuestionsInQs(state$, questions, node);
      } else {
        questions[tp.first_node_id] = node;
      }
    });
    return questions;
  }
}
