import { actions } from './types.actions';

export const updateConditionValue = (index, callerId, value, type) => ({
  type: actions.UPDATE_CONDITION_VALUE,
  payload: { index, callerId, value, type },
});

export const updateMedicalCaseProperty = (property, newValue) => ({
  type: actions.UPDATE_MEDICAL_CASE,
  payload: { property, newValue },
});

export const setMedicalCase = (medicalCase) => ({
  type: actions.MC_SET,
  payload: {
    medicalCase,
  },
});
export const clearMedicalCase = () => ({
  type: actions.MC_CLEAR,
});

export const setAnswer = (index, value) => ({
  type: actions.SET_ANSWER,
  payload: {
    index,
    value,
  },
});

export const setAnswerUnavailable = (index, value) => ({
  type: actions.SET_ANSWER_TO_UNAVAILABLE,
  payload: {
    index,
    value,
  },
});

export const dispatchNodeAction = (nodeId, callerId, callerType) => ({
  type: actions.HANDLE_NODE_CHANGED,
  payload: {
    nodeId,
    callerId,
    callerType,
  },
});

export const dispatchRelatedNodeAction = (nodeId) => ({
  type: actions.DISPATCH_RELATED_NODE_ACTION,
  payload: {
    nodeId,
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

export const dispatchCondition = (diagnosticId, nodeId) => ({
  type: actions.DISPATCH_CONDITION,
  payload: {
    diagnosticId,
    nodeId,
  },
});

export const setPsAnswer = (indexPs, answer) => ({
  type: actions.MC_PREDEFINED_SYNDROME_SET_ANSWER,
  payload: {
    indexPs,
    answer,
  },
});

export const dispatchQuestionsSequenceAction = (questionsSequenceId, callerId) => ({
  type: actions.DISPATCH_QUESTIONS_SEQUENCE_ACTION,
  payload: {
    questionsSequenceId,
    callerId,
  },
});

export const dispatchFinalDiagnosticAction = (diagnosticId, finalDiagnosticId) => ({
  type: actions.DISPATCH_FINAL_DIAGNOSTIC_ACTION,
  payload: {
    diagnosticId,
    finalDiagnosticId,
  },
});
