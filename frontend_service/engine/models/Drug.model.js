// @flow
import { HealthCaresModel } from './HealthCares.model';
import { medicationForms } from '../../constants';
import { store } from '../../store';
import { roundSup } from '../../../src/utils/swissKnives';
import { calculateCondition } from '../../algorithm/conditionsHelpers.algo';

export class DrugModel extends HealthCaresModel {
  constructor(props) {
    super(props);

    const { formulationSelected = null } = props;
    this.formulationSelected = formulationSelected;
    this.healthCareObject = 'drugs';
  }

  /**
   * Set the right dose calculation for the treatment.
   *
   * @return [object] : doses for the treatment, it depend by healthcare type (liquid, tab, pill, etc...)
   */
  getDrugDoses = (formulationIndex, algorithm) => {
    // TODO: Check with algorithm
    const drug = algorithm.nodes[this.id];

    const medicalCase = store.getState();
    const mcWeight = medicalCase.nodes[algorithm.config.basic_questions.weight_question_id];

    let minDoseMg;
    let maxDoseMg;
    let doseResult;
    let doseResultMg;
    let recurrence;
    let pillSize;

    // select formulation
    const formulation = drug.formulations[formulationIndex];

    if (formulation === undefined) {
      return { doseResult: null };
    }

    // protected by_age
    if ((mcWeight !== undefined && mcWeight.value !== null) || formulation.by_age === false) {
      recurrence = 24 / formulation.doses_per_day;

      switch (formulation.medication_form) {
        case medicationForms.syrup:
        case medicationForms.suspension:
        case medicationForms.powder_for_injection:
        case medicationForms.solution:
          minDoseMg = roundSup((mcWeight.value * formulation.minimal_dose_per_kg) / formulation.doses_per_day);
          maxDoseMg = roundSup((mcWeight.value * formulation.maximal_dose_per_kg) / formulation.doses_per_day);

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
          minDoseMg = roundSup((mcWeight.value * formulation.minimal_dose_per_kg) / formulation.doses_per_day);
          maxDoseMg = roundSup((mcWeight.value * formulation.maximal_dose_per_kg) / formulation.doses_per_day);
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
              // TODO: FUCK YOU
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

  /**
   * Get drugs from 3 objects and return one object (manual merging)
   * Object from :
   * - Proposed
   * - Additional
   *
   * @return : object list all drugs
   *
   */
  static getAgreed = (diagnoses = null, algorithm) => {
    let currentDiagnoses;
    let currentAdditionalDrugs;

    const medicalCase = store.getState();
    const drugs = {};
    const doubleString = ['proposed', 'additional'];

    if (diagnoses === null) {
      currentDiagnoses = medicalCase.diagnoses;
      currentAdditionalDrugs = medicalCase.diagnoses.additionalDrugs;
    } else {
      currentDiagnoses = diagnoses;
      currentAdditionalDrugs = diagnoses.additionalDrugs;
    }

    doubleString.forEach((iteration) => {
      Object.keys(currentDiagnoses[iteration]).forEach((diagnoseId) => {
        // If diagnoses selected or additional (auto selected)
        const finalDiagnostic = currentDiagnoses[iteration][diagnoseId];
        if (finalDiagnostic.agreed === true || iteration === 'additional') {
          // Iterate over drugs
          Object.keys(finalDiagnostic.drugs).forEach((drugId) => {
            const diagnoseDrug = finalDiagnostic.drugs[drugId];
            const drug = medicalCase.nodes[drugId];
            if (diagnoseDrug.agreed === true && calculateCondition(algorithm, diagnoseDrug, medicalCase) === true && !drug.isExcluded(medicalCase, algorithm)) {
              if (drugs[drugId] === undefined) {
                // New one so add it
                drugs[drugId] = finalDiagnostic?.drugs[drugId];
                drugs[drugId].diagnoses = [{ id: diagnoseId, type: iteration }];
              } else {
                // Already exist, manage it
                drugs[drugId].diagnoses.push({ id: diagnoseId, type: iteration });
                if (finalDiagnostic?.drugs[drugId].duration > drugs[drugId].duration) {
                  drugs[drugId].duration = finalDiagnostic?.drugs[drugId].duration;
                }
              }
            }
          });
        }
      });
    });

    // Iterate over manually added drugs
    Object.keys(currentAdditionalDrugs).forEach((ky) => {
      if (drugs[ky] === undefined) {
        // New one so add it
        drugs[ky] = currentAdditionalDrugs[ky];
        drugs[ky].diagnoses = [null];
      }
    });

    return drugs;
  };
}
