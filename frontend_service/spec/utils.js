// Save algorithm in store to use it in test
import { createAppContainer } from 'react-navigation';
import find from 'lodash/find';
import moment from 'moment';
import { MedicalCaseModel } from '../helpers/MedicalCase.model';
import { store } from '../store';
import { setAnswer, setMedicalCase, setDiagnoses, setMedicine } from '../actions/creators.actions';
import { RootMainNavigator } from '../../src/engine/navigation/Root.navigation';
import { valueFormats } from '../constants';
import { finalDiagnosticAll, finalDiagnosticGetDrugs } from '../helpers/FinalDiagnostic.model';
import { calculateCondition } from '../algorithm/conditionsHelpers.algo';
import { drugDoses } from '../helpers/Drug.model';

export const cl = console.log;
export const algorithm = require('./algorithm.json');

const medicalCase = new MedicalCaseModel({}, algorithm);
store.dispatch(setMedicalCase(medicalCase));
createAppContainer(RootMainNavigator);

/**
 * Set answer to a node
 * @param nodeId
 * @param value
 */
export const jestSetAnswer = (nodeId, value) => {
  store.dispatch(setAnswer(algorithm, nodeId, value));
};

/**
 * Set birth date from age given in days
 * @param nodeId
 * @param ageInDays
 */
export const setBirthDate = (nodeId, ageInDays) => {
  const birthDate = moment().subtract(ageInDays, 'days');
  jestSetAnswer(nodeId, birthDate);
};

/**
 * Get answer id
 * @param nodeId
 * @returns {*}
 */
export const getAnswer = (nodeId) => {
  const state$ = store.getState();
  return state$.nodes[nodeId].answer;
};

/**
 * Get answer value
 * @param nodeId
 * @returns {*}
 */
export const getValue = (nodeId) => {
  const state$ = store.getState();
  return state$.nodes[nodeId].value;
};

/**
 * Get node properties
 * @param nodeId
 * @returns {*}
 */
export const getNode = (nodeId) => {
  const state$ = store.getState();
  return state$.nodes[nodeId];
};

/**
 * Get boolean answer value
 * @param nodeId
 * @returns {null|boolean}
 */
export const booleanAnswer = (nodeId) => {
  const state$ = store.getState();
  const mcNode = state$.nodes[nodeId];
  const currentNode = algorithm.nodes[nodeId];
  if (currentNode.value_format === valueFormats.bool) {
    if (mcNode.answer === null) return null;
    const idYes = Number(Object.keys(mcNode.answers)[0]);
    const idNo = Number(Object.keys(mcNode.answers)[1]);
    if (mcNode.answer === idYes) return true;
    if (mcNode.answer === idNo) return false;
  } else {
    cl('This node is not Boolean', nodeId);
  }
};

/**
 * Test if final diagnostic is retained by algorithm
 * @param finalDiagnosticId
 * @returns {boolean}
 */
export const finalDiagnosticRetained = (finalDiagnosticId) => {
  const dfs = finalDiagnosticAll(algorithm);
  return dfs.included.map((df) => df.id).includes(finalDiagnosticId);
};

/**
 * Get node condition value
 * @param id: Node Id
 * @param elemId: diagnostic Id | QS Id
 * @param elem : dd | qs default = dd
 * @returns {boolean}
 */
export const conditionValue = (id, elemId, elem = 'dd') => {
  const state$ = store.getState();
  return find(state$?.nodes[id][elem], (cv) => cv.id === elemId).conditionValue;
};

/**
 * Valid a final diagnostic proposed
 * @param diagnosesKey
 * @param finalDiagnosticId
 */
export const validFinalDiagnostic = (finalDiagnosticId, diagnosesKey = 'proposed') => {
  const state$ = store.getState();
  // const mcFinalDiagnostic = state$.nodes[finalDiagnosticId];
  const currentFinalDiagnostic = algorithm.nodes[finalDiagnosticId];

  // Do not ask FFS
  if (diagnosesKey === 'proposed') {
    store.dispatch(
      setDiagnoses(algorithm, diagnosesKey, {
        id: finalDiagnosticId,
        label: currentFinalDiagnostic.label,
        diagnostic_id: currentFinalDiagnostic.diagnostic_id,
        agreed: true,
        drugs: currentFinalDiagnostic.drugs,
        managements: currentFinalDiagnostic.managements,
      })
    );
  } else {
    store.dispatch(
      setDiagnoses(algorithm, diagnosesKey, {
        [finalDiagnosticId]: {
          id: finalDiagnosticId,
          label: currentFinalDiagnostic.label,
          diagnostic_id: currentFinalDiagnostic.diagnostic_id,
          agreed: true,
          drugs: currentFinalDiagnostic.drugs,
          managements: currentFinalDiagnostic.managements,
        },
      })
    );
  }
};

/**
 * Valid a medicine
 * @param type
 * @param medicineId
 * @param finalDiagnosticId
 * @param value
 * @params healthCareType
 */
export const validMedicine = (type, medicineId, finalDiagnosticId, value, healthCareType) => {
  store.dispatch(setMedicine(type, finalDiagnosticId, medicineId, value, healthCareType));
};

/**
 * Test if drug is retained by algorithm
 * @param drugId
 * @returns {boolean}
 */
export const drugRetained = (drugId) => {
  const state$ = store.getState();
  const finalDiagnostics = {
    ...state$.diagnoses.proposed,
    ...state$.diagnoses.additional,
  };
  let drugs = [];

  Object.keys(finalDiagnostics).forEach((key) => {
    drugs = drugs.concat(finalDiagnosticGetDrugs(algorithm, state$, state$.nodes[key]));
  });
  return drugs.some((drug) => drug.id === drugId);
};

/**
 * Test if management is retained by algorithm
 * @param managementId
 * @returns {boolean}
 */
export const managementRetained = (managementId) => {
  const medicalCase = store.getState();
  const finalDiagnostics = {
    ...medicalCase.diagnoses.proposed,
    ...medicalCase.diagnoses.additional,
  };
  const managements = [];

  Object.keys(finalDiagnostics).forEach((key) => {
    if (finalDiagnostics[key].managements !== undefined && Object.keys(finalDiagnostics[key].managements).length > 0) {
      Object.keys(finalDiagnostics[key].managements).map((managementKey) => {
        const management = finalDiagnostics[key].managements[managementKey];
        if (calculateCondition(algorithm, management, medicalCase) === true && !management.isExcluded(medicalCase)) {
          managements.push(management);
        }
      });
    }
  });

  return managements.map((management) => management.id).includes(managementId);
};

/**
 * Get drug doses result
 * @param drugId
 * @param formulationId
 * @returns {{doseResult: null}|{doseResult: null, no_possibility: string}|{recurrence: *, doseResult: *, doseResultMg: *, maxDoseMg: *, minDoseMl: number, maxDoseMl: number, minDoseMg: *}|{recurrence: *, doseResult: *, maxDoseCap: number, maxDoseMg: *, minDoseMg: *, minDoseCap: number}}
 */
export const getDrugDoses = (drugId, formulationId) => {
  const drug = algorithm.nodes[drugId];
  const formulationIndex = drug.formulations.findIndex((formulation) => formulation.id === formulationId);
  return drugDoses(formulationIndex, algorithm, drugId);
};
