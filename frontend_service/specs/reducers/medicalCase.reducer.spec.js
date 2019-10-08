import find from 'lodash/find';
import {
  setMedicalCase,
  setAnswer,
} from '../../actions/creators.actions';
import { store } from '../../store';
import 'reflect-metadata';


const algorithm = require('../algorithm');

const answer = (id, value) => {
  store.dispatch(setAnswer(id, value));
};
const getAnswer = (id) => {
  const state$ = store.getState();
  return state$.nodes[id].answer;
};

const conditionValue = (id, elemId, elem = 'dd') => {
  const state$ = store.getState();
  return find(state$.nodes[id][elem], (cv) => cv.id === elemId).conditionValue;
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

  it('should update all child of a node in QS when updating the a node', () => {
    answer(66, 133);
    expect(conditionValue(182, 181, 'qs')).toEqual(true);
    expect(conditionValue(186, 181, 'qs')).toEqual(true);
  });
});
