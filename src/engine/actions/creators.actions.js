import { actions } from './types.actions';

export const addTodo = (id) => ({
  type: actions.MEDICAL_CASE_INITIATE,
  payload: id,
});

export const middlewareTest = (id) => ({
  type: actions.MEDICAL_CASE_NEW,
  payload: id,
});

export const initiateMedicalCase = (medicalCase) => ({
  type: actions.MEDICAL_CASE_INITIATE,
  payload: medicalCase,
});

export const setMedicalCase = (medicalCase) => ({
  type: actions.MEDICAL_CASE_SET,
  payload: {
    medicalCase,
  },
});
