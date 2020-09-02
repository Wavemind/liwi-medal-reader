import find from 'lodash/find';
import moment from 'moment';
import { createAppContainer } from 'react-navigation';
import { setAnswer, setMedicalCase } from '../../actions/creators.actions';
import { store } from '../../store';
import 'reflect-metadata';
import { valueFormats } from '../../constants';
import { RootMainNavigator } from '../../../src/engine/navigation/Root.navigation';
import { FinalDiagnosticModel } from '../../engine/models/FinalDiagnostic.model';

const algorithm = require('../algorithm');

export const cl = console.log;
// console.log = () => {};
console.error = () => {};
console.warn = () => {};

// Save algorithm in store to use it in test
store.dispatch(setMedicalCase(algorithm));
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

const conditionValue = (id, elemId, elem = 'dd') => {
  const state$ = store.getState();
  return find(state$?.nodes[id][elem], (cv) => cv.id === elemId).conditionValue;
};

describe('actions', () => {
  // it('should access to state as Class items', () => {
  //   store.dispatch(setMedicalCase(algorithm));
  //   const state$ = store.getState();
  //   const filterQuestions = state$.nodes.filterByCategory(state$.nodes, 'symptom');
  //
  //   expect(filterQuestions).not.toEqual([]);
  // });

  it('Should return Significant hemoptysis for Pneumonia diagnosis', () => {
    jestSetAnswer(1, moment('2020-05-20').format());
    jestSetAnswer(50, 39);
    jestSetAnswer(13, 22); // CC - Respiratory complaint -> yes
    // jestSetAnswer(25, 36); // History of fever -> yes
    // jestSetAnswer(40, 76); // Difficulty breathing -> yes
    // jestSetAnswer(34, 55); // Grunting -> no
    jestSetAnswer(5, 20); // Respiratory rate -> 1
    // jestSetAnswer(33, 1000); // Blood oxygen saturation -> 1000
    // jestSetAnswer(62, 121); // Severe difficult breathing needing referral -> no
    // jestSetAnswer(1687, 753); // Significant hemoptysis (>1 episode) -> yese
    // expect(booleanAnswer(38)).toEqual(true);
    expect(getAnswer(9)).toEqual(13);
    // expect(booleanAnswer(58)).toEqual(false);
    // const df = FinalDiagnosticModel.all();
    // console.log(df.included)

    // expect(getAnswer(1666)).toEqual(734);
  });

  //
  // it('test clinical case 1', (done) => {
  //   answer(66, true);
  //   // expect(booleanNodeAnswer(181)).toEqual(true);
  //   answer(66, 133);
  //   // expect(conditionValue(182, 181, 'qs')).toEqual(true);
  //   // expect(conditionValue(186, 181, 'qs')).toEqual(true);
  //   answer(182, 269);
  //   // expect(conditionValue(113, 181, 'qs')).toEqual(true);
  //   answer(113, 253);
  //   // expect(booleanNodeAnswer(181)).toEqual(null);
  //   answer(104, 2);
  //   expect(booleanNodeAnswer(186)).toEqual(true);
  //   expect(booleanNodeAnswer(181)).toEqual(true);
  //   answer(104, 7);
  //   expect(booleanNodeAnswer(186)).toEqual(false);
  //   expect(booleanNodeAnswer(181)).toEqual(false);
  //
  //   // final diagnostic
  //   expect(booleanNodeAnswer(1175)).toEqual(false);
  //   done();
  // });
  //
  // it('should reset all the QS to the origine', (done) => {
  //   answer(66, 133);
  //   expect(conditionValue(182, 181, 'qs')).toEqual(true);
  //   expect(conditionValue(186, 181, 'qs')).toEqual(true);
  //
  //   answer(182, null);
  //   answer(104, null);
  //   answer(113, null);
  //   answer(66, null);
  //
  //   expect(booleanNodeAnswer(113)).toEqual(null);
  //   expect(booleanNodeAnswer(182)).toEqual(null);
  //   expect(booleanNodeAnswer(66)).toEqual(null);
  //
  //   expect(conditionValue(182, 181, 'qs')).toEqual(false);
  //   expect(conditionValue(186, 181, 'qs')).toEqual(false);
  //   expect(conditionValue(113, 181, 'qs')).toEqual(false);
  //
  //   expect(booleanNodeAnswer(186)).toEqual(null);
  //   expect(booleanNodeAnswer(181)).toEqual(null);
  //   done();
  // });
});
