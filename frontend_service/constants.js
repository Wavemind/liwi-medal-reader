export const host = 'http://liwi.wavelab.top/api/v1/';
// export const host = 'http://192.168.1.5:3000/api/v1/'; // quent
// export const host = 'http://192.168.31.214:3000/api/v1/'; // manu
// export const host = 'http://192.168.1.4:3000/api/v1/'; // alain

// Hash used to encrypt local password
export const saltHash =
  'x9gKs?RBf*96RK2DAM+&$CYv7A3Gjp=?X&RBLS%9KeL8Q3dSGjUzL_?2Vye3';

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
};

// Value of answer accepted
export const valueFormats = {
  array: 'Array',
  int: 'Integer',
  float: 'Float',
  bool: 'Boolean',
};

// Priority of questions
export const priorities = {
  basic: 'basic',
  mandatory: 'mandatory',
};

// Stage of questions
export const stage = {
  registration: 'registration',
  triage: 'triage',
  test: 'test',
  consultation: 'consultation',
};

// Node category
export const categories = {
  assessment: 'assessment_test',
  chronicalCondition: 'chronical_condition',
  vitalSign: 'vital_sign',
  firstLookAssessment: 'first_look_assessment',
  exposure: 'exposure',
  physicalExam: 'physical_exam',
  symptom: 'symptom',
  demographic: 'demographic',
  comorbidity: 'comorbidity',
  chiefComplaint: 'chief_complaint',
  predefinedSyndrome: 'predefined_syndrome',
  triage: 'triage',
  vaccine: 'vaccine',
  scored: 'scored',
  treatment: 'treatment',
  management: 'management',
  other: 'other',
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
  waitingTriage: 'waiting_triage',
  triage: 'triage',
  waitingConsultation: 'waiting_consultation',
  consultation: 'consultation',
  waitingTest: 'waiting_test',
  test: 'test',
  waitingDiagnostic: 'waiting_diagnostic',
  final_diagnostic: 'final_diagnostic',
  close: 'close',
};
