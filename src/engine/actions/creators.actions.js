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

export const incrementCounter = (nodeId) => ({
  type: actions.MC_INCREMENT_COUNTER,
  payload: { nodeId },
});

export const decrementCounter = (nodeId) => ({
  type: actions.MC_DECREMENT_COUNTER,
  payload: { nodeId },
});

export const setMedicalCase = (medicalCase) => ({
  type: actions.MEDICAL_CASE_SET,
  payload: {
    medicalCase,
  },
});

export const initialCounter = () => ({
  type: actions.MEDICAL_CASE_SET,
  payload: {},
});

export const setQuestion = (index, value) => ({
  type: actions.MC_QUESTION_SET,
  payload: {
    index,
    value,
  },
});

export const nodeOfThisChildren = (indexNode, indexChild, type = null) => ({
  type: actions.MC_NODE_CHILDREN,
  payload: {
    indexNode,
    indexChild,
    type,
  },
});

export const updatePatient = (index, value) => ({
  type: actions.MC_UPDATE_PATIENT,
  payload: {
    index: index,
    value: value,
  },
});

export const diseasesChildren = (indexDD, indexChild) => ({
  type: actions.MC_DISEASES_CHILDREN,
  payload: {
    indexDD,
    indexChild,
  },
});

export const diagnosisChildren = (indexDD, indexDiagnosis) => ({
  type: actions.MC_DIAGNOSIS_CHILDREN,
  payload: {
    indexDD,
    indexDiagnosis,
  },
});
