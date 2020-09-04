import find from 'lodash/find';
import moment from 'moment';
import { createAppContainer } from 'react-navigation';
import { setAnswer, setMedicalCase } from '../../actions/creators.actions';
import { store } from '../../store';
import 'reflect-metadata';
import { valueFormats } from '../../constants';
import '../../../src/utils/Prototype.native';
import { RootMainNavigator } from '../../../src/engine/navigation/Root.navigation';
import { FinalDiagnosticModel } from '../../engine/models/FinalDiagnostic.model';
import { MedicalCaseModel } from '../../engine/models/MedicalCase.model';

const algorithm = require('../algorithm');

export const cl = console.log;
// console.log = () => {};
console.error = () => {};
console.warn = () => {};

// Save algorithm in store to use it in test
const medicalCase = new MedicalCaseModel({}, algorithm);
store.dispatch(setMedicalCase(medicalCase));
createAppContainer(RootMainNavigator);

const jestSetAnswer = (nodeId, value) => {
  store.dispatch(setAnswer(nodeId, value));
};
const getAnswer = (nodeId) => {
  const state$ = store.getState();
  return state$.nodes[nodeId].answer;
};

const getValue = (nodeId) => {
  const state$ = store.getState();
  return state$.nodes[nodeId].value;
};

const getNode = (nodeId) => {
  const state$ = store.getState();
  return state$.nodes[nodeId];
};

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const booleanAnswer = (nodeId) => {
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

const finalDiagnosticRetained = (diagnosticId) => {
  const dfs = FinalDiagnosticModel.all();
  return dfs.included.map((df) => df.id).includes(diagnosticId);
};

const conditionValue = (id, elemId, elem = 'dd') => {
  const state$ = store.getState();
  return find(state$?.nodes[id][elem], (cv) => cv.id === elemId).conditionValue;
};

describe('actions', () => {
  it('Should return Significant hemoptysis for Pneumonia diagnosis', () => {
    jestSetAnswer(1, moment('2020-05-20').format()); // Birth date -> 2020.05.20
    jestSetAnswer(214, 394); // Gender -> Male
    jestSetAnswer(3, 5); // Weight -> 5
    jestSetAnswer(13, 22); // CC - Respiratory complaint -> yes
    jestSetAnswer(461, 725); // CC - General -> yes

    jestSetAnswer(50, 39); // Axiliary temperature -> 39

    jestSetAnswer(25, 36); // History of fever -> yes
    jestSetAnswer(40, 76); // Difficulty breathing -> yes
    jestSetAnswer(34, 55); // Grunting -> absent
    jestSetAnswer(18, 27); // Chest indrawing -> no
    jestSetAnswer(5, 70); // Respiratory rate -> 1
    jestSetAnswer(33, 1000); // Blood oxygen saturation -> 1000
    jestSetAnswer(62, 121); // Severe difficult breathing needing referral -> no
    jestSetAnswer(1687, 753); // Significant hemoptysis (>1 episode) -> yes

    // expect(finalDiagnosticRetained(1688)).toEqual(true);
    // expect(getAnswer(59)).toEqual(119)
    // expect(booleanAnswer(58)).toEqual(false);
    // expect(getAnswer(18)).toEqual(27)
    // expect(getValue(50)).toEqual(39);
    // expect(getAnswer(58)).toEqual(117);
    // console.log(getValue(58))
    expect(finalDiagnosticRetained(1688)).toEqual(true)
    // expect(getAnswer(1666)).toEqual(734);
  });
});
