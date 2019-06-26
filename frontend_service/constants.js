export const host = 'http://192.168.31.220:8000';
// export const host = 'https://liwi.wavelab.top/api/v1/';
// export const host = 'http://192.168.1.5:3000/api/v1/'; // quent
// export const host = 'http://192.168.31.214:3000/api/v1/'; // manu
// export const host = 'http://192.168.1.4:3000/api/v1/'; // alain

export const saltHash =
  'x9gKs?RBf*96RK2DAM+&$CYv7A3Gjp=?X&RBLS%9KeL8Q3dSGjUzL_?2Vye3';

// Const about nodes
export const nodesType = {
  d: 'diseases',
  fd: 'FinalDiagnostic',
  m: 'Management',
  qs: 'QuestionsSequence',
  q: 'Question',
  t: 'Treatment',
  h: 'HealthCare',
};

export const displayFormats = {
  radioButton: 'RadioButton',
  checkBox: 'CheckBox',
  input: 'Input',
  list: 'DropDownList',
};

export const displayValues = {
  array: 'Array',
  int: 'Integer',
  float: 'Float',
  bool: 'Boolean',
};

export const priorities = {
  basic: 'basic',
  mandatory: 'mandatory',
};

export const stage = {
  registration: 'registration',
  triage: 'triage',
  test: 'test',
  consultation: 'consultation',
};

export const categories = {
  assessment: 'assessment_test',
  exposure: 'exposure',
  physicalExam: 'physical_exam',
  symptom: 'symptom',
  demographic: 'demographic',
  comorbidity: 'comorbidity',
  chiefComplain: 'chief_complain',
  predefinedSyndrome: 'predefined_syndrome',
  triage: 'triage',
  vaccine: 'vaccine',
  scored: 'scored',
  treatment: 'treatment',
  management: 'management',
};

// export const categories = {
//   assessment: 'Assessment/Test',
//   exposure: 'Exposure',
//   physicalExam: 'Physical exam',
//   symptom: 'Symptom',
//   predefinedCondition: 'Predefined condition',
//   comorbidity: 'Comorbidity',
//   predefinedSyndrome: 'Predefined syndrome',
// };

export const typeNode = {
  question: 'Question',
  management: 'Management',
  questionsSequence: 'QuestionsSequence',
  treatment: 'Treatment',
};

/*
* Demographics (D)
Vaccines (V)
Comorbidities (DC)
Chief Complain (CC)
Exposure (E)
Symptoms (S)
Physical Exam/Signs (PE)
Assessement/Test (A)
Predifined Syndroms (PS)
* */

export const medicalCaseStatus = {
  waitingTriage: 'waiting_triage',
  triage: 'triage',
  waitingConsultation: 'waiting_consultation',
  consultation: 'consultation',
  waitingTest: 'waiting_test',
  test: 'test',
  waitingDiagnosis: 'waiting_diagnosis',
  diagnosis: 'diagnosis',
  close: 'close',
};
