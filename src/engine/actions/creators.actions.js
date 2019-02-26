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

export const conditionValueChange = (nodeId, diseaseId, value) => ({
  type: actions.MC_CONDITION_VALUE_CHANGE,
  payload: { nodeId, diseaseId, value },
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

export const nextBatch = () => ({
  type: actions.MC_GENERATE_NEXT_BATCH,
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

export const predefinedSyndromeChildren = (indexPS, indexChild) => ({
  type: actions.MC_PREDEFINED_SYNDROME_CHILDREN,
  payload: {
    indexPS,
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
