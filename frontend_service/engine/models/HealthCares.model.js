// @flow
/* eslint-disable no-case-declarations */
import { NodeModel } from './Node.model';
import { healthCareType, nodesType } from '../../constants';
import { store } from '../../store';
import { roundSup } from '../../../src/utils/swissKnives';

interface HealthCaresInterface { }

export class HealthCaresModel extends NodeModel implements HealthCaresInterface {
  constructor(props) {
    super(props);

    const {
      description = '',
      label = '',

    } = props;

    this.description = description;
    this.label = label;
  }

  /**
   *  Get questions related to a healthcare
   *
   *  @params [Object] instanceHealthcare: the instance from a final Diagnostic (management or treatment)
   *  @return [Object] questions
   */
  getQuestions(instanceHealthcare) {
    const state$ = store.getState();
    const questions = {};
    instanceHealthcare.top_conditions.map((tp) => {
      const node = state$.nodes[tp.first_node_id];
      if (node.type === nodesType.questionsSequence) {
        this.getQuestionsInQs(state$, questions, node);
      } else {
        questions[tp.first_node_id] = node;
      }
    });
    return questions;
  }

  /**
  * Recursive call to get question in QS from QS
  *
  * @params [Object] state$, [Object] questions, [Object] node: the node we want questions
  * @return nothing : Immutability
  */
  getQuestionsInQs = (state$, questions, node) => {
    Object.keys(node.instances).map((id) => {
      if (state$.nodes[id].type === nodesType.questionsSequence) {
        this.getQuestionsInQs(state$, questions, state$.nodes[id]);
      } else {
        questions[id] = state$.nodes[id];
      }
    });
  };
}
