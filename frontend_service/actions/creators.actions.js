import { actions } from './types.actions';

export const conditionValueDiseasesChange = (nodeId, diseaseId, value) => ({
  type: actions.MC_CONDITION_VALUE_DISEASES_CHANGE,
  payload: { nodeId, diseaseId, value },
});

export const conditionValueQSChange = (nodeId, psId, value) => ({
  type: actions.MC_CONDITION_VALUE_QS_CHANGE,
  payload: { nodeId, psId, value },
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

export const setAnswer = (index, value) => ({
  type: actions.SET_ANSWER,
  payload: {
    index,
    value,
  },
});

export const dispatchNodeAction = (
  node,
  caller,
) => ({
  type: actions.HANDLE_NODE_CHANGED,
  payload: {
    node,
    caller,
  },
});

export const dispatchPSAction = (indexPS, indexNode) => ({
  type: actions.MC_PS_CHILDREN,
  payload: {
    indexPS,
    indexNode,
  },
});

export const updatePatient = (index, value) => ({
  type: actions.MC_UPDATE_PATIENT,
  payload: {
    index: index,
    value: value,
  },
});

export const setVitalSigns = (index, value) => ({
  type: actions.MC_SET_VITAL_SIGNS,
  payload: { index: index, value: value },
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

export const questionsSequencesChildren = (indexPS, indexChild) => ({
  type: actions.MC_QUESTIONS_SEQUENCES_CHILDREN,
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
