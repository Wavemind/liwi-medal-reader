import { actions } from './types.actions';

export const conditionValueChange = (nodeId, diseaseId, value) => ({
  type: actions.MC_CONDITION_VALUE_CHANGE,
  payload: { nodeId, diseaseId, value },
});

export const setMedicalCase = (medicalCase) => ({
  type: actions.MC_SET,
  payload: {
    medicalCase,
  },
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

export const dispatchNodeAction = (indexNode, indexChild, type = null) => ({
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

export const setPsAnswer = (indexPs, answer) => ({
  type: actions.MC_PREDEFINED_SYNDROME_SET_ANSWER,
  payload: {
    indexPs,
    answer,
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
