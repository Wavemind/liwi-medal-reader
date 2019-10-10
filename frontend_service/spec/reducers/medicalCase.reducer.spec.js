import find from 'lodash/find';
import { setAnswer, setMedicalCase } from '../../actions/creators.actions';
import { store } from '../../store';
import 'reflect-metadata';

/* Special import
 * This import is necessary for rewrite prototype function JS
 * */
// eslint-disable-next-line no-unused-vars
import Prototype from '../../../src/utils/Prototype.native';
import { valueFormats } from '../../constants';

// eslint-disable-next-line no-console
export const cl = console.log;

/**
 * Disabled all for a nice read
 */
// eslint-disable-next-line no-console
console.log = () => {};
console.error = () => {};
console.warn = () => {};

const algorithm = require('../algorithm');

const answer = (id, value) => {
  store.dispatch(setAnswer(id, value));
};
const getAnswer = (id) => {
  const state$ = store.getState();
  return state$.nodes[id].answer;
};

const booleanNodeAnswer = (id) => {
  const state$ = store.getState();
  const node = state$.nodes[id];
  if (node.value_format === valueFormats.bool) {
    if (node.answer === null) return null;
    const idYes = Number(Object.keys(node.answers).first());
    const idNo = Number(Object.keys(node.answers).second());
    if (node.answer === idYes) return true;
    if (node.answer === idNo) return false;
  } else {
    cl('This node is not Boolean', id);
  }
};

const conditionValue = (id, elemId, elem = 'dd') => {
  const state$ = store.getState();
  return find(state$?.nodes[id][elem], (cv) => cv.id === elemId).conditionValue;
};

describe('actions', () => {
  it('should access to state as Class items', () => {
    store.dispatch(setMedicalCase(algorithm));
    const state$ = store.getState();
    const filterQuestions = state$.nodes.filterByCategory('symptom');

    expect(filterQuestions).not.toEqual([]);
  });

  it('should be able to set an answer to a question', () => {
    answer(66, 132);
    expect(getAnswer(66)).toEqual(132);
  });

  it('should set qs 181 to true with direct link', (done) => {
    answer(66, 132);
    expect(booleanNodeAnswer(181)).toEqual(true);
    expect(conditionValue(182, 181, 'qs')).toEqual(false);
    expect(conditionValue(186, 181, 'qs')).toEqual(false);
    done();
  });

  it('should reset qs 181 and set to true with other branch', (done) => {
    answer(66, null);
    expect(booleanNodeAnswer(181)).toEqual(null);
    answer(66, 133);
    expect(conditionValue(182, 181, 'qs')).toEqual(true);
    expect(conditionValue(186, 181, 'qs')).toEqual(true);
    answer(182, 269);
    expect(conditionValue(113, 181, 'qs')).toEqual(true);
    answer(113, 253);
    expect(booleanNodeAnswer(181)).toEqual(null);
    answer(104, 2);
    expect(booleanNodeAnswer(186)).toEqual(true);
    expect(booleanNodeAnswer(181)).toEqual(true);
    answer(104, 7);
    expect(booleanNodeAnswer(186)).toEqual(false);
    expect(booleanNodeAnswer(181)).toEqual(false);
    done();
  });

  it('should reset all the QS to the origine', (done) => {
    answer(66, 133);
    expect(conditionValue(182, 181, 'qs')).toEqual(true);
    expect(conditionValue(186, 181, 'qs')).toEqual(true);

    answer(182, null);
    answer(104, null);
    answer(113, null);
    answer(66, null);

    expect(booleanNodeAnswer(113)).toEqual(null);
    expect(booleanNodeAnswer(182)).toEqual(null);
    expect(booleanNodeAnswer(66)).toEqual(null);

    expect(conditionValue(182, 181, 'qs')).toEqual(false);
    expect(conditionValue(186, 181, 'qs')).toEqual(false);
    expect(conditionValue(113, 181, 'qs')).toEqual(false);

    expect(booleanNodeAnswer(186)).toEqual(null);
    expect(booleanNodeAnswer(181)).toEqual(null);
    done();
  });
});
