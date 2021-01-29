import { actions } from './types.actions';

export const addConsentFile = (page) => ({
  type: actions.ADD_CONSENT_FILE,
  payload: { page },
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

export const setDiagnoses = (algorithm, type, diagnoses, actionDiagnoses) => ({
  type: actions.SET_DIAGNOSES,
  payload: {
    algorithm,
    type,
    diagnoses,
    actionDiagnoses,
  },
});

export const setAdditionalMedicineDuration = (id, duration) => ({
  type: actions.SET_ADDITIONAl_MEDICINE_DURATION,
  payload: {
    id,
    duration,
  },
});

export const setMedicine = (finalDiagnosticId, diagnoseKey, medicineId, boolean, healthCareType) => ({
  type: actions.SET_MEDICINE,
  payload: {
    finalDiagnosticId,
    diagnoseKey,
    medicineId,
    boolean,
    healthCareType,
  },
});

export const setCustomMedicine = (diagnosesKey, medicine, type) => ({
  type: actions.SET_CUSTOM_MEDICINE,
  payload: {
    diagnosesKey,
    medicine,
    type,
  },
});

export const setAdditionalMedicine = (medicines) => ({
  type: actions.SET_ADDITIONAL_MEDICINE,
  payload: {
    medicines,
  },
});

export const setAdditionalManagement = (management) => ({
  type: actions.SET_ADDITIONAL_MANAGEMENT,
  payload: {
    management,
  },
});

export const setFormulationSelected = (diagnoseId, formulation, type, drugId) => ({
  type: actions.SET_FORMULATION_SELECTED,
  payload: {
    diagnoseId,
    formulation,
    type,
    drugId,
  },
});

// TODO Check WTF this shit is
export const updateMetaData = (screen, view, value) => ({
  type: actions.MC_UPDATE_METADATA,
  payload: {
    screen,
    view,
    value,
  },
});

export const updateModalFromRedux = (params = {}, type = '') => ({
  type: actions.MC_UPDATE_MODAL,
  payload: {
    params,
    type,
  },
});

export const clearMedicalCase = () => ({
  type: actions.MC_CLEAR,
});

export const setAnswer = (algorithm, nodeId, newValue) => ({
  type: actions.SET_ANSWER,
  payload: {
    algorithm,
    nodeId,
    newValue,
  },
});

export const setPatient = (patient, algorithm) => ({
  type: actions.SET_PATIENT,
  payload: {
    patient,
    algorithm,
  },
});

export const setPatientValue = (index, value) => ({
  type: actions.SET_PATIENT_VALUE,
  payload: {
    index,
    value,
  },
});

export const setEstimable = (index, value) => ({
  type: actions.SET_ESTIMABLE,
  payload: {
    index,
    value,
  },
});

export const setUnavailable = (algorithm, nodeId, value) => ({
  type: actions.SET_UNAVAILABLE,
  payload: {
    algorithm,
    nodeId,
    value,
  },
});

export const updatePatient = (index, value) => ({
  type: actions.MC_UPDATE_PATIENT,
  payload: {
    index,
    value,
  },
});

export const dispatchFinalDiagnosticAction = (diagnosticId, finalDiagnosticId) => ({
  type: actions.DISPATCH_FINAL_DIAGNOSTIC_ACTION,
  payload: {
    diagnosticId,
    finalDiagnosticId,
  },
});
