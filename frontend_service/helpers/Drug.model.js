// @flow
import { healthCareIsExcluded } from './HealthCares.model';
import { medicationForms } from '../constants';
import { store } from '../store';
import { roundSup } from '../../src/utils/swissKnives';
import { calculateCondition } from '../algorithm/conditionsHelpers.algo';
import i18n from '../../src/utils/i18n';
import toReadableFraction from '../../src/utils/toReadableFraction';

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
  if (mcWeight !== undefined && mcWeight.value !== null && !formulation.by_age) {
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
        doseResult = roundSup((minDoseMl + maxDoseMl) / 2);

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

        if (maxDoseCap < 1) {
          return {
            ...formulation,
            no_possibility: i18n.t('drug:no_options'),
            doseResult: null,
          };
        }
        if (Math.ceil(doseResult) <= maxDoseCap) {
          // Viable Solution
          doseResult = Math.ceil(doseResult);
        } else if (Math.floor(doseResult) >= minDoseCap) {
          // Other viable solution
          doseResult = Math.floor(doseResult);
        } else {
          // Out of possibility
          // Request on 09.02.2021 if no option available we give the min dose cap LIWI-1150
          doseResult = Math.floor(minDoseCap);
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

/**
 * Returns a string with the amount of breakable to give to the patient
 * @param drugDose - related drug informations
 * @returns {string} - amount of breakable to give to the patient
 */
export const breakableFraction = (drugDose) => {
  const unit = drugDose.doseResult / drugDose.breakable;
  const num = Math.floor(unit);
  let result = '';

  if (num > 0 && num !== Infinity) {
    result = num;
  }
  if (drugDose.doseResult !== null) {
    const rest = drugDose.doseResult % drugDose.breakable;

    if (rest !== 0) {
      const r = toReadableFraction(rest / drugDose.breakable);
      if (r.numerator === 1 && r.denominator === 2) {
        result += ' ½';
      } else if (r.numerator === 1 && r.denominator === 4) {
        result += ' ¼';
      } else if (r.numerator === 3 && r.denominator === 4) {
        result += ' ¾';
      } else {
        // other fraction
        result = `${result} ${r.numerator} / ${r.denominator}`;
      }
    }
  }
  return result;
};

/**
 * Formulation display
 * @param calculatedFormulation
 * @returns {string}
 */
export const formulationLabel = (calculatedFormulation) => {
  switch (calculatedFormulation.medication_form) {
    case medicationForms.pessary:
    case medicationForms.spray:
    case medicationForms.patch:
    case medicationForms.inhaler: {
      return `${calculatedFormulation.description}: ${roundSup(calculatedFormulation.unique_dose)} ${i18n.t(`medication_form:${calculatedFormulation.medication_form}`).toLowerCase()}`;
    }
    case medicationForms.tablet:
    case medicationForms.capsule: {
      if (calculatedFormulation.by_age) {
        return `${calculatedFormulation.description}: ${roundSup(calculatedFormulation.unique_dose)} ${i18n.t('drug:tablets')}`;
      }
      return `${roundSup(calculatedFormulation.dose_form)}mg ${calculatedFormulation.medication_form}: ${
        calculatedFormulation.doseResult !== null ? `${breakableFraction(calculatedFormulation)} ${i18n.t('drug:tablets')}` : i18n.t('drug:no_options')
      }`;
    }
    case medicationForms.cream:
    case medicationForms.ointment:
    case medicationForms.gel:
    case medicationForms.drops: {
      return `${calculatedFormulation.description}`;
    }
    case medicationForms.syrup:
    case medicationForms.suspension:
    case medicationForms.powder_for_injection:
    case medicationForms.solution: {
      if (calculatedFormulation.by_age) {
        return `${calculatedFormulation.description}: ${roundSup(calculatedFormulation.unique_dose)}ml`;
      }
      return `${roundSup(calculatedFormulation.liquid_concentration)}mg/${roundSup(calculatedFormulation.dose_form)}ml ${i18n.t(`medication_form:${calculatedFormulation.medication_form}`).toLowerCase()}: ${
        calculatedFormulation.doseResult
      }ml ${i18n.t('medication_form:per_administration')}`;
    }
    default: {
      return `(${calculatedFormulation.medication_form}) ${t('drug:medication_form_not_handled')}`;
    }
  }
};
