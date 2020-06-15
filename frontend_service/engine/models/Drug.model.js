// @flow

import { HealthCaresModel } from './HealthCares.model';
import { medicationForms } from '../../constants';
import { store } from '../../store';
import { roundSup } from '../../../src/utils/swissKnives';

export class DrugModel extends HealthCaresModel {
  constructor(props) {
    super(props);

    const {
      category,
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
      is_anti_malarial = false,
      is_antibiotic = false,
    } = props;

    this.category = category;
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
    this.is_anti_malarial = is_anti_malarial;
    this.is_antibiotic = is_antibiotic;
  }

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
        case medicationForms.syrup:
        case medicationForms.suspension:
        case medicationForms.powder_for_injection:
        case medicationForms.solution:
          minDoseMg = roundSup((weightNode.value * formulation.minimal_dose_per_kg) / formulation.doses_per_day);
          maxDoseMg = roundSup((weightNode.value * formulation.maximal_dose_per_kg) / formulation.doses_per_day);

          // Second calculate min and max dose (cap)
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

        case medicationForms.capsule:
        case medicationForms.tablet:
          // First calculate min and max dose (mg/Kg)
          minDoseMg = roundSup((weightNode.value * formulation.minimal_dose_per_kg) / formulation.doses_per_day);
          maxDoseMg = roundSup((weightNode.value * formulation.maximal_dose_per_kg) / formulation.doses_per_day);
          pillSize = formulation.dose_form; // dose form

          if (formulation.breakable !== null) {
            pillSize /= formulation.breakable;
          }

          // Second calculate min and max dose (cap)
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
            // Out of possibility
            return {
              no_possibility: 'No compatible option for this weight',
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
          // Other use case will be here in future
          break;
      }
    }
    return { doseResult: null, ...formulation };
  };
}
