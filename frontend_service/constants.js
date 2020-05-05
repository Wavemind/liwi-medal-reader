// Server address
export const host = 'https://liwi.wavelab.top/api/v1/';
// export const host = 'https://medalc.unisante.ch/api/v1';
export const hostDataServer = 'https://liwi-main-data.herokuapp.com/api/';

export const secondStatusLocalData = 5000;

export const navigationStateKey = 'navigationState';
export const appInBackgroundStateKey = 'appBackground';

export const databaseInterface = {
  realmInterface: 'realmInterface',
  httpInterface: 'httpInterface',
};

// Nodes types
export const nodeTypes = {
  diagnostic: 'diagnostic',
  finalDiagnostic: 'FinalDiagnostic',
  questionsSequence: 'QuestionsSequence',
  question: 'Question',
  healthCare: 'HealthCare',
};

export const displayFormats = {
  radioButton: 'RadioButton',
  input: 'Input',
  dropDownList: 'DropDownList',
  formula: 'Formula',
  reference: 'Reference', // table reference
  string: 'String',
  date: 'Date',
};

export const medicationForms = {
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

export const stages = {
  registration: 'registration',
  triage: 'triage',
  test: 'test',
  consultation: 'consultation',
  diagnosis_management: 'diagnosis_management',
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
  null: 'General', // TODO: must be remove when all diag is ok ! 22.04.2020
};

export const categories = {
  assessment: 'assessment_test',
  chronicCondition: 'chronic_condition',
  basicMeasurement: 'basic_measurement',
  uniqueTriageQuestion: 'unique_triage_question',
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
  treatmentQuestion: 'treatment_question',
  backgroundCalculation: 'background_calculation',
  vitalSignAnthropometric: 'vital_sign_anthropometric',
  observedPhysicalSign: 'observed_physical_sign',
  consultationRelated: 'consultation_related',
  uniqueTriagePhysicalSign: 'unique_triage_physical_sign',
};

// Type of Tool Tip
export const toolTipType = {
  medicalCaseLocked: 'medicalCaseLocked',
  algorithmVersion: 'algorithmVersion',
  validation: 'validation',
  loading: 'loading',
};

export const userRoles = {
  clinician: 'Clinician',
  registration_desk: 'Registration Desk',
  triage_nurse: 'Triage Nurse',
  lab: 'Lab',
  pharmacist: 'Pharmacist',
  guest: 'Guest',
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
      route = 'Triage';
      break;
    case medicalCaseStatus.consultation.name:
    case medicalCaseStatus.waitingConsultation.name:
      route = 'Consultation';
      break;
    case medicalCaseStatus.tests.name:
    case medicalCaseStatus.waitingTests.name:
      route = 'Tests';
      break;
    case medicalCaseStatus.final_diagnostic.name:
    case medicalCaseStatus.waitingDiagnostic.name:
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
