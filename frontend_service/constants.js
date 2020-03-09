// export const host = 'http://liwi.wavelab.top/api/v1/';
export const host = 'http://192.168.31.214:3000/api/v1/';
// export const host = 'https://medalc.unisante.ch/api/v1';
export const hostDataServer = 'https://liwi-main-data.herokuapp.com/api/';

export const navigationStateKey = 'navigationState';
export const alreadyLaunchedStateKey = 'alreadyLaunched';
export const appInBackgroundStateKey = 'appBackground';
// Hash used to encrypt local password
export const saltHash = 'x9gKs?RBf*96RK2DAM+&$CYv7A3Gjp=?X&RBLS%9KeL8Q3dSGjUzL_?2Vye3';

// Nodes types
export const nodesType = {
  diagnostic: 'diagnostic',
  finalDiagnostic: 'FinalDiagnostic',
  management: 'Management',
  questionsSequence: 'QuestionsSequence',
  question: 'Question',
  treatment: 'Treatment',
  healthCare: 'HealthCare',
};

// Display answer format
export const displayFormats = {
  radioButton: 'RadioButton',
  checkBox: 'CheckBox',
  input: 'Input',
  list: 'DropDownList',
  formula: 'Formula',
  reference: 'Reference',
  string: 'String',
  date: 'Date',
};

export const healthCareType = {
  tablet: 'tablet',
  capsule: 'capsule',
  suspension: 'suspension',
  syrup: 'syrup',
  suppository: 'suppository',
  drops: 'drops',
  solution: 'solution',
  patch: 'patch',
  cream: 'cream',
  ointment: 'ointment',
  gel: 'gel',
  spray: 'spray',
  inhaler: 'inhaler',
};

// Value of answer accepted
export const valueFormats = {
  array: 'Array',
  int: 'Integer',
  float: 'Float',
  bool: 'Boolean',
  string: 'String',
  date: 'Date',
  present: 'Present',
  positive: 'Positive',
};

// Stage of questions
export const stage = {
  registration: 'registration',
  triage: 'triage',
  test: 'test',
  consultation: 'consultation',
};

export const systems = {
  general: 'General',
  respiratory_circulation: 'Respiratory and circulatory system',
  ear_nose_mouth_throat: 'Ear, nose, mouth and throat system',
  visual: 'Visual system',
  integumentary: 'Integumentary system',
  digestive: 'Digestive system',
  urinary_reproductive: 'Urinary and reproductive system',
  nervous: 'Nervous system',
  muscular_skeletal: 'Muscular and skeletal system',
  null: 'General',
};

// Node category
export const categories = {
  assessment: 'assessment_test',
  chronicCondition: 'chronic_condition',
  vitalSignTriage: 'vital_sign_triage',
  emergencySign: 'emergency_sign',
  exposure: 'exposure',
  physicalExam: 'physical_exam',
  symptom: 'symptom',
  demographic: 'demographic',
  comorbidity: 'comorbidity',
  complaintCategory: 'complaint_category',
  predefinedSyndrome: 'predefined_syndrome',
  triage: 'triage',
  vaccine: 'vaccine',
  scored: 'scored',
  drug: 'drug',
  management: 'management',
  other: 'other',
  treatmentQuestion: 'treatment_question',
  backgroundCalculation: 'background_calculation',
  vitalSignConsultation: 'vital_sign_consultation',
  observedPhysicalSign: 'observed_physical_sign',
};

// Type of nodes received from json
export const typeNode = {
  question: 'Question',
  management: 'Management',
  questionsSequence: 'QuestionsSequence',
  treatment: 'Treatment',
};

// Status of medical cases
export const medicalCaseStatus = {
  inCreation: { name: 'in_creation', index: -1, main: 0 },
  waitingTriage: { name: 'waiting_triage', index: 0, main: null },
  triage: { name: 'triage', index: 1, main: 1 },
  waitingConsultation: { name: 'waiting_consultation', index: 2, main: null },
  consultation: { name: 'consultation', index: 3, main: 2 },
  waitingTests: { name: 'waiting_tests', index: 4, main: null },
  tests: { name: 'tests', index: 5, main: 3 },
  waitingDiagnostic: { name: 'waiting_diagnostic', index: 6, main: null },
  final_diagnostic: { name: 'final_diagnostic', index: 7, main: 4 },
  close: { name: 'close', index: 8, main: 5 },
};

export const routeDependingStatus = (medicalCase) => {
  let route;

  switch (medicalCase.status) {
    case medicalCaseStatus.inCreation.name:
      route = 'PatientUpsert';
      break;
    case medicalCaseStatus.waitingTriage.name:
    case medicalCaseStatus.triage.name:
    case medicalCaseStatus.waitingConsultation.name:
      route = 'Triage';
      break;
    case medicalCaseStatus.consultation.name:
    case medicalCaseStatus.waitingTests.name:
      route = 'Consultation';
      break;
    case medicalCaseStatus.tests.name:
    case medicalCaseStatus.waitingDiagnostic.name:
      route = 'Tests';
      break;
    case medicalCaseStatus.final_diagnostic.name:
      route = 'DiagnosticsStrategy';
      break;
    case medicalCaseStatus.close.name:
      route = 'Summary';
      break;
  }

  return route;
};

export const navigationActionConstant = {
  navigate: 'Navigation/NAVIGATE',
  replace: 'Navigation/REPLACE',
  setParams: 'Navigation/SET_PARAMS',
};
