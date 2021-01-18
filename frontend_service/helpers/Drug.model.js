// @flow
import { healthCareIsExcluded } from './HealthCares.model';
import { medicationForms } from '../constants';
import { store } from '../store';
import { roundSup } from '../../src/utils/swissKnives';
import { calculateCondition } from '../algorithm/conditionsHelpers.algo';
import i18n from '../../src/utils/i18n';

/**
 * Set the right dose calculation for a drug.
 * @param formulationIndex
 * @param algorithm
 * @param drugId
 * @returns {{doseResult: null}|{doseResult: null, no_possibility: string}|{recurrence: *, doseResult: *, doseResultMg: *, maxDoseMg: *, minDoseMl: number, maxDoseMl: number, minDoseMg: *}|{recurrence: *, doseResult: *, maxDoseCap: number, maxDoseMg: *, minDoseMg: *, minDoseCap: number}}
 */
export const drugDoses = (formulationIndex, algorithm, drugId) => {
  const drug = algorithm.nodes[drugId];

  const medicalCase = store.getState();
  const mcWeight = medicalCase.nodes[algorithm.config.basic_questions.weight_question_id];

  let minDoseMg;
  let maxDoseMg;
  let doseResult;
  let doseResultMg;
  let pillSize;

  // Select formulation
  const formulation = drug.formulations[formulationIndex];

  if (formulation === undefined) {
    return { doseResult: null };
  }

  const recurrence = 24 / formulation.doses_per_day;

  // Age and weight must be answered to calculate dosage
  if ((mcWeight !== undefined && mcWeight.value !== null) && !formulation.by_age) {
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

        // If we reach the limit / day
        if (doseResultMg * formulation.doses_per_day > formulation.maximal_dose) {
          doseResultMg = formulation.maximal_dose / formulation.doses_per_day;
          doseResult = (doseResultMg * formulation.dose_form) / formulation.liquid_concentration;
        }

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
            ...formulation,
            no_possibility: i18n.t('drug:no_options'),
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
        break;
    }
  }
  return { doseResult: null, recurrence, ...formulation };
};

/**
 * Get agreed drugs and return a new object
 * @param diagnoses
 * @param algorithm
 * @returns {{
 *   proposed: {},
 *   additional: {}
 * }}
 */
export const drugAgreed = (diagnoses, algorithm) => {
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
          if (diagnoseDrug.agreed === true && calculateCondition(algorithm, diagnoseDrug, medicalCase) === true && !healthCareIsExcluded(medicalCase, algorithm, drug)) {
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
