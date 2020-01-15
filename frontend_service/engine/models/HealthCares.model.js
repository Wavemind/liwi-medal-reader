// @flow
/* eslint-disable no-case-declarations */
import { NodeModel } from './Node.model';
import { healthCareType, nodesType } from '../../constants';
import { store } from '../../store';
import { roundSup } from '../../../src/utils/swissKnives';

interface HealthCaresInterface {}

export class HealthCaresModel extends NodeModel implements HealthCaresInterface {
  constructor(props) {
    super(props);

    const {
      description = '',
      label = '',
      weight_question_id = '',
      minimal_dose_per_kg = '',
      maximal_dose_per_kg = '',
      maximal_dose = '',
      doses_per_day = '',
      treatment_type = '',
      pill_size = '',
      drugDoses = null,
    } = props;

    this.description = description;
    this.label = label;
    this.weight_question_id = weight_question_id;
    this.minimal_dose_per_kg = minimal_dose_per_kg;
    this.maximal_dose_per_kg = maximal_dose_per_kg;
    this.maximal_dose = maximal_dose;
    this.doses_per_day = doses_per_day;
    this.treatment_type = treatment_type;
    this.pill_size = pill_size;
    this.drugDoses = drugDoses;
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

  getDrugDoses = () => {
    const state$ = store.getState();
    let weightNode = state$.nodes[this.weight_question_id];
    if (weightNode.value !== null) {
      switch (this.treatment_type) {
        case healthCareType.liquid:
          break;

        case healthCareType.pill:
          // First calcule min and max dose (mg/Kg)
          let minDoseMg = roundSup((weightNode.value * this.minimal_dose_per_kg) / this.doses_per_day);
          let maxDoseMg = roundSup((weightNode.value * this.maximal_dose_per_kg) / this.doses_per_day);

          // Second calcule min and max dose (cap)
          let minDoseCap = roundSup((1 / this.pill_size) * minDoseMg);
          let maxDoseCap = roundSup((1 / this.pill_size) * maxDoseMg);

          // Define Dose Result
          // TODO Result more efficient with data from PMU... waiting
          let doseResult = Math.floor(maxDoseCap);

          return {
            minDoseMg,
            maxDoseMg,
            minDoseCap,
            maxDoseCap,
            doseResult,
          };
          // eslint-disable-next-line no-unreachable
          break;
      }
    }
  };

  /**
   *  Get questions related to a healthcare
   *
   *  @params [Object] instanceHealthcare: the instance from a final Diagnostic (management or treatment)
   *  @return [Object] questions
   */
  getQuestions(instanceHealthcare) {
    const state$ = store.getState();
    let questions = {};
    instanceHealthcare.top_conditions.map((tp) => {
      let node = state$.nodes[tp.first_node_id];
      if (node.type === nodesType.questionsSequence) {
        this.getQuestionsInQs(state$, questions, node);
      } else {
        questions[tp.first_node_id] = node;
      }
    });
    return questions;
  }
}
