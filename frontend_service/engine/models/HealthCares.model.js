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
      weight_question_id = null,
      minimal_dose_per_kg = '',
      maximal_dose_per_kg = '',
      maximal_dose = '',
      doses_per_day = '',
      treatment_type = '',
      pill_size = '',
      drugDoses = null,
      formulations = [],
      formulationSelected = null,
    } = props;

    this.description = description;
    this.label = label;
    this.weight_question_id = weight_question_id;
    this.minimalDosePerKg = minimal_dose_per_kg;
    this.maximalDosePerKg = maximal_dose_per_kg;
    this.maximalDose = maximal_dose;
    this.dosesPerDay = doses_per_day;
    this.treatmentType = treatment_type;
    this.pillSize = pill_size;
    this.drugDoses = drugDoses;
    this.formulations = formulations;
    this.formulationSelected = formulationSelected;
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
  getDrugDoses = (formulationSelected) => {
    const state$ = store.getState();

    const weightNode = state$.nodes[this.weight_question_id];

    let minDoseMg;
    let maxDoseMg;
    let doseResult;
    let doseResultMg;
    let recurrence;
    let pillSize;

    // select formulation
    const formulation = this.formulations.find((e) => e.medication_form === formulationSelected);

    if (formulation === undefined) {
      return { doseResult: null };
    }

    // protected by_age
    if ((weightNode !== undefined && weightNode.value !== null) || formulation.by_age === false) {
      recurrence = 24 / formulation.doses_per_day;

      switch (formulation.medication_form) {
        case healthCareType.syrup:
        case healthCareType.suspension:
          minDoseMg = roundSup((weightNode.value * formulation.minimal_dose_per_kg) / formulation.doses_per_day);
          maxDoseMg = roundSup((weightNode.value * formulation.maximal_dose_per_kg) / formulation.doses_per_day);

          // Second calcule min and max dose (cap)
          const minDoseMl = roundSup((minDoseMg * formulation.dose_form) / formulation.liquid_concentration);
          const maxDoseMl = roundSup((maxDoseMg * formulation.dose_form) / formulation.liquid_concentration);

          // Round
          doseResult = Math.round((minDoseMl + maxDoseMl) / 2);

          if (doseResult > maxDoseMl) {
            doseResult -= 1;
          }

          doseResultMg = (doseResult * formulation.liquid_concentration) / formulation.dose_form;

          // if we reach the limit / day
          if (doseResultMg * formulation.doses_per_day > formulation.maximal_dose) {
            doseResultMg = formulation.maximal_dose / formulation.doses_per_day;
            doseResult = (doseResultMg * formulation.dose_form) / formulation.liquid_concentration;
          }

          // Frequency

          return {
            minDoseMg,
            maxDoseMg,
            minDoseMl,
            maxDoseMl,
            doseResult,
            doseResultMg,
            recurrence,
            ...formulation,
          };

        case healthCareType.capsule:
        case healthCareType.tablet:
          // First calcule min and max dose (mg/Kg)
          minDoseMg = roundSup((weightNode.value * formulation.minimal_dose_per_kg) / formulation.doses_per_day);
          maxDoseMg = roundSup((weightNode.value * formulation.maximal_dose_per_kg) / formulation.doses_per_day);
          pillSize = formulation.dose_form; // dose form

          if (formulation.breakable !== null) {
            pillSize /= formulation.breakable;
          }

          // Second calcule min and max dose (cap)
          const minDoseCap = roundSup((1 / pillSize) * minDoseMg);
          const maxDoseCap = roundSup((1 / pillSize) * maxDoseMg);

          // Define Dose Result
          doseResult = (minDoseCap + maxDoseCap) / 2;

          if (Math.ceil(doseResult) <= maxDoseCap) {
            // Viable Solution
            doseResult = Math.ceil(doseResult);
          } else if (Math.floor(doseResult) >= minDoseCap) {
            // Other viable solution
            doseResult = Math.floor(doseResult);
          } else {
            // Out of possiblity
            return {
              no_possibility: 'The weight has no correspondance',
              doseResult: null,
            };
          }

          return {
            minDoseMg,
            maxDoseMg,
            minDoseCap,
            maxDoseCap,
            doseResult,
            recurrence,
            ...formulation,
          };
        default:
          // Other use case will be here in futur
          break;
      }
    }
    return { doseResult: null, ...formulation };
  };

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
}
