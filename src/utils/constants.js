import {Dimensions} from 'react-native';

export const blueColor = '#fff';
export const liwiColors = {
  redColor: '#db473e',
  blackColor: '#595959',
  whiteColor: '#f1f1f1',
  greyColor: '#a0a0a0',
  greenColor: '#37b428',
};
export const sessionsDuration = 30; // in minutes

export const devHost = 'https://liwi.wavelab.top';
// export const devHost = 'http://192.168.1.5:3000'; // quent
// export const devHost = 'http://192.168.31.214:3000'; // manu
// export const devHost = 'http://192.168.1.4:3000'; // alain

export const saltHash =
  'x9gKs?RBf*96RK2DAM+&$CYv7A3Gjp=?X&RBLS%9KeL8Q3dSGjUzL_?2Vye3';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

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
};

export const displayValues = {
  array: 'Array',
  int: 'Integer',
  float: 'Float',
  bool: 'Boolean',
};

export const priorities = {
  basic: 'Basic',
  priority: 'Priority',
  triage: 'Triage',
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
