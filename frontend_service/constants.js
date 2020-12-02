import { getItem } from '../src/engine/api/LocalStorage';

// Server address
export const host = async () => {
  const environment = await getItem('environment');

  switch (environment) {
    case 'production':
      return 'https://medalc.unisante.ch/api/v1/';
    case 'staging':
      return 'https://liwi.wavelab.top/api/v1/';
    case 'test':
    default:
      return 'https://liwi-test.wavelab.top/api/v1/';
  }
};

export const secondStatusLocalData = 5000;

export const navigationStateKey = 'navigationState';
export const navigationRoute = 'navigationRoute';

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
  autocomplete: 'Autocomplete',
  date: 'Date',
};

export const medicationForms = {
  tablet: 'tablet',
  capsule: 'capsule',
  syrup: 'syrup',
  suspension: 'suspension',
  suppository: 'suppository',
  drops: 'drops',
  solution: 'solution',
  powder_for_injection: 'powder_for_injection',
  patch: 'patch',
  cream: 'cream',
  pessary: 'pessary',
  ointment: 'ointment',
  gel: 'gel',
  spray: 'spray',
  inhaler: 'inhaler',
};

export const administrationRouteCategories = ['Enteral', 'Parenteral injectable', 'Mucocutaneous'];

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
  chronic_conditions: 'Chronic conditions',
  comorbidities: 'Comorbidities',
  complementary_medical_history: 'Complementary Medical History Questions',
  digestive: 'Digestive system',
  ear_nose_mouth_throat: 'Ear, nose, mouth and throat system',
  exposures: 'Exposures',
  general: 'General',
  integumentary: 'Skin/Hair/Mucosae system',
  prevention: 'Prevention',
  prophylaxis: 'Prophylaxis',
  respiratory_circulation: 'Respiratory and circulatory system',
  muscular_skeletal: 'Muscular and skeletal system',
  nervous: 'Nervous system',
  urinary_reproductive: 'Urinary and reproductive system',
  visual: 'Visual system',
  vital_sign: 'Vital Signs',
  null: 'No assigned system',
};

export const systemsOrder = [
  'chronic_conditions',
  'comorbidities',
  'complementary_medical_history',
  'digestive',
  'ear_nose_mouth_throat',
  'exposures',
  'general',
  'integumentary',
  'prevention',
  'prophylaxis',
  'respiratory_circulation',
  'muscular_skeletal',
  'nervous',
  'urinary_reproductive',
  'visual',
  'vital_sign',
  'null',
];

export const categories = {
  assessment: 'assessment_test',
  chronicCondition: 'chronic_condition',
  basicMeasurement: 'basic_measurement',
  basicDemographic: 'basic_demographic',
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
export const modalType = {
  about: 'about',
  algorithmVersion: 'algorithmVersion',
  consentFile: 'consentFile',
  description: 'description',
  medicalCaseLocked: 'medicalCaseLocked',
  validation: 'validation',
  loading: 'loading',
  emergency: 'emergency',
  emergencyWarning: 'emergencyWarning',
};

export const userRoles = {
  medical_doctor: 'Medical Doctor (MD)',
  assistant_medical_officer: 'Assistant Medical Officer (AMO)',
  clinical_officer: 'Clinical Officer (CO)',
  nurse: 'Nurse',
  midwife: 'Midwife',
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
  finalDiagnostic: { name: 'final_diagnostic', index: 7, main: 4 },
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
    case medicalCaseStatus.finalDiagnostic.name:
    case medicalCaseStatus.waitingDiagnostic.name:
      route = 'DiagnosticsStrategy';
      break;
    case medicalCaseStatus.close.name:
      route = 'Summary';
      break;
  }

  return route;
};

export const references = {
  z_score_male_table: require('./api/z_score_male_table.json'),
  z_score_female_table: require('./api/z_score_female_table.json'),
  heart_rate_table: require('./api/heart_rate_table.json'),
  respiratory_rate_table: require('./api/respiratory_rate_table.json'),
  muac_z_score_female_table: require('./api/muac_z_score_female.json'),
  muac_z_score_male_table: require('./api/muac_z_score_male.json'),
  bmi_for_age_female_table: require('./api/bmi_for_age_female.json'),
  bmi_for_age_male_table: require('./api/bmi_for_age_male.json'),
  weight_for_height_female_table: require('./api/weight_for_height_female.json'),
  weight_for_height_male_table: require('./api/weight_for_height_male.json'),
  weight_for_length_female_table: require('./api/weight_for_length_female.json'),
  weight_for_length_male_table: require('./api/weight_for_length_male.json'),
};

export const navigationActionConstant = {
  navigate: 'Navigation/NAVIGATE',
  replace: 'Navigation/REPLACE',
  setParams: 'Navigation/SET_PARAMS',
};
