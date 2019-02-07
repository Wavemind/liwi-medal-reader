// TODO Flow type moi sa !
export const medicalCaseInitialState = {
  id: 1,
  userId: null,
  algoId: 1,
  createdDate: null,
  algorithmReady: false,
  patient: {
    firstname: 'Quentin',
    lastname: 'Girard',
    birthdate: '02.03.1994',
    gender: 1,
    weight: '',
    height: '',
    temperature: '',
    heartbeat: '',
    breathingRhythm: '',
  },
  trip: {
    firstSymptomDate: '18.05.2018',
    startDate: '01.05.2018',
    endDate: '24.05.2018',
    countries: [],
  },
  comments: {
    exposures: {
      content: null,
    },
    signs: {
      content: null,
    },
    symptoms: {
      content: null,
    },
    tests: {
      content: null,
    },
    diagnostics: {
      content: null,
    },
  },
  answers: {},
  managementsSelected: [],
  treatmentsSelected: [],
  nodes: {},
  final: {},
  syndromes: {},
};
