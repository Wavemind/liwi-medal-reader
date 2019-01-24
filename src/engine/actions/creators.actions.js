import { actions } from './types.actions';

export const addTodo = (id) => ({
  type: actions.MEDICAL_CASES_INITIATE,
  payload: id,
});

export const middlewareTest = (id) => ({
  type: actions.MEDICAL_CASES_NEW,
  payload: id,
});
