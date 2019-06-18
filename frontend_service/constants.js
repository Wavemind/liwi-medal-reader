export const host = 'https://liwi.wavelab.top/api/v1/';
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
  ps: 'PredefinedSyndrome',
  q: 'Question',
  t: 'Treatment',
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
  triage: 'triage',
  priority: 'priority',
};

export const categories = {
  assessment: 'Assessment/Test',
  exposure: 'Exposure',
  physicalExam: 'Physical exam',
  symptom: 'Symptom',
  predefinedCondition: 'Predefined condition',
  comorbidity: 'Comorbidity',
  predefinedSyndrome: 'Predefined syndrome',
};

export const MCstatus = {
  wft: 'Waiting for triage',
  t: 'Triage',
  wfc: 'Waiting for consultation',
  wfte: 'Waiting for test',
  wfd: 'Waiting for diagnosis',
  d: 'Diagnosis',
  c: 'Close',
};
