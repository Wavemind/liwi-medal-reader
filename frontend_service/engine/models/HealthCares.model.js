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
    this.weightQuestionId = weight_question_id;
    this.minimalDosePerKg = minimal_dose_per_kg;
    this.maximalDosePerKg = maximal_dose_per_kg;
    this.maximalDose = maximal_dose;
    this.dosesPerDay = doses_per_day;
    this.treatmentType = treatment_type;
    this.pillSize = pill_size;
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

  /**
   * Set the right dose calculation for the treatment.
   *
   * @return [object] : doses for the treatment, it depend by healthcare type (liquid, tab, pill, etc...)
   */
  getDrugDoses = () => {
    const state$ = store.getState();
    const weightNode = state$.nodes[this.weightQuestionId];
    if (weightNode.value !== null) {
      switch (this.treatmentType) {
        case healthCareType.liquid:
          break;

        case healthCareType.pill:
          // First calcule min and max dose (mg/Kg)
          const minDoseMg = roundSup((weightNode.value * this.minimalDosePerKg) / this.dosesPerDay);
          const maxDoseMg = roundSup((weightNode.value * this.maximalDosePerKg) / this.dosesPerDay);

          // Second calcule min and max dose (cap)
          const minDoseCap = roundSup((1 / this.pillSize) * minDoseMg);
          const maxDoseCap = roundSup((1 / this.pillSize) * maxDoseMg);

          // Define Dose Result
          // TODO Result more efficient with data from PMU... waiting
          const doseResult = Math.floor(maxDoseCap);

          return {
            minDoseMg,
            maxDoseMg,
            minDoseCap,
            maxDoseCap,
            doseResult,
          };
        default:
          // TODO implement logic on the next feature posologie
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
