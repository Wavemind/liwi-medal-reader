// Save algorithm in store to use it in test
import { createAppContainer } from 'react-navigation';
import find from 'lodash/find';
import moment from 'moment';
import { MedicalCaseModel } from '../engine/models/MedicalCase.model';
import { store } from '../store';
import { setAnswer, setMedicalCase, setDiagnoses, setMedicine } from '../actions/creators.actions';
import { RootMainNavigator } from '../../src/engine/navigation/Root.navigation';
import { valueFormats } from '../constants';
import { FinalDiagnosticModel } from '../engine/models/FinalDiagnostic.model';
import { calculateCondition } from '../algorithm/conditionsHelpers.algo';

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
  const node = state$.nodes[nodeId];
  if (node.value_format === valueFormats.bool) {
    if (node.answer === null) return null;
    const idYes = Number(Object.keys(node.answers)[0]);
    const idNo = Number(Object.keys(node.answers)[1]);
    if (node.answer === idYes) return true;
    if (node.answer === idNo) return false;
  } else {
    cl('This node is not Boolean', nodeId);
  }
};

/**
 * Test if final diagnostic is retained by algorithm
 * @param finalDiagnosticId
 * @returns {boolean}
 */
export const finalDiagnosticRetained = (finalDiagnosticId,) => {
  const dfs = FinalDiagnosticModel.all(algorithm);
  return dfs.included.map((df) => df.id).includes(finalDiagnosticId);
};

/**
 * Get node condition value
 * @param id
 * @param elemId
 * @param elem
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
export const validFinalDiagnostic = (diagnosesKey, finalDiagnosticId) => {
  const state$ = store.getState();
  const finalDiagnostic = state$.nodes[finalDiagnosticId];

  // Do not ask FFS
  if (diagnosesKey === 'proposed') {
    store.dispatch(
      setDiagnoses(diagnosesKey, {
        id: finalDiagnosticId,
        label: finalDiagnostic.label,
        diagnostic_id: finalDiagnostic.diagnostic_id,
        agreed: true,
        drugs: finalDiagnostic.drugs,
        managements: finalDiagnostic.managements,
      })
    );
  } else {
    store.dispatch(
      setDiagnoses(diagnosesKey, {
        [finalDiagnosticId]: {
          id: finalDiagnosticId,
          label: finalDiagnostic.label,
          diagnostic_id: finalDiagnostic.diagnostic_id,
          agreed: true,
          drugs: finalDiagnostic.drugs,
          managements: finalDiagnostic.managements,
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
    drugs = drugs.concat(state$.nodes[key].getDrugs(state$));
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
