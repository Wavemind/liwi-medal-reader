import i18n from '../../../utils/i18n';

// routing render by object, more clean
export const renderingDrawerItems = [
  {
    type: 'categorie',
    initialPage: 0,
    name: 'PatientUpsert',
    routeName: 'PatientUpsert',
    t: i18n.t('menu:patientUpsert'),
  },
  {
    type: 'categorie',
    initialPage: 0,
    name: 'Triage',
    routeName: 'Triage',
    t: i18n.t('menu:triage'),
  },
  // {
  //   type: 'path',
  //   initialPage: 0,
  //   routeName: 'Triage',
  // },
  // {
  //   type: 'item',
  //   initialPage: 0,
  //   name: 'Triage',
  //   routeName: 'Triage',
  //   t: i18n.t('menu:first_look_assessments'),
  // },
  {
    type: 'path',
    initialPage: 0,
    routeName: 'Triage',
  },
  {
    type: 'item',
    initialPage: 0,
    name: 'Triage',
    routeName: 'Triage',
    t: i18n.t('menu:complaint_categories'),
  },
  {
    type: 'path',
    initialPage: 1,
    routeName: 'Triage',
  },
  {
    type: 'item',
    initialPage: 1,
    name: 'Triage',
    routeName: 'Triage',
    t: i18n.t('menu:basic_measurements'),
  },
  {
    type: 'categorie',
    initialPage: 0,
    name: 'Consultation',
    routeName: 'Consultation',
    t: i18n.t('menu:consultation'),
  },
  {
    type: 'path',
    initialPage: 0,
    routeName: 'Consultation',
  },
  {
    type: 'item',
    initialPage: 0,
    name: 'Consultation',
    routeName: 'Consultation',
    t: i18n.t('menu:medical_history'),
  },
  {
    type: 'path',
    initialPage: 1,
    routeName: 'Consultation',
  },
  {
    type: 'item',
    initialPage: 1,
    name: 'Consultation',
    routeName: 'Consultation',
    t: i18n.t('menu:physical_exam'),
  },
  {
    type: 'path',
    initialPage: 2,
    routeName: 'Consultation',
  },
  {
    type: 'item',
    initialPage: 2,
    name: 'Consultation',
    routeName: 'Consultation',
    t: i18n.t('menu:comment'),
  },
  {
    type: 'categorie',
    initialPage: 0,
    name: 'Tests',
    routeName: 'Tests',
    t: i18n.t('menu:tests'),
  },
  {
    type: 'categorie',
    initialPage: 0,
    name: 'DiagnosticsStrategy',
    routeName: 'DiagnosticsStrategy',
    t: i18n.t('menu:strategy'),
  },
];

// routing render by object, more clean
export const armControlRenderingDrawerItems = [
  {
    type: 'categorie',
    initialPage: 0,
    name: 'PatientUpsert',
    routeName: 'PatientUpsert',
    t: i18n.t('menu:patientUpsert'),
  },
  {
    type: 'categorie',
    initialPage: 0,
    name: 'Triage',
    routeName: 'Triage',
    t: i18n.t('menu:triage'),
  },
  // {
  //   type: 'path',
  //   initialPage: 0,
  //   routeName: 'Triage',
  // },
  // {
  //   type: 'item',
  //   initialPage: 0,
  //   name: 'Triage',
  //   routeName: 'Triage',
  //   t: i18n.t('menu:first_look_assessments'),
  // },
  {
    type: 'path',
    initialPage: 0,
    routeName: 'Triage',
  },
  {
    type: 'item',
    initialPage: 0,
    name: 'Triage',
    routeName: 'Triage',
    t: i18n.t('menu:complaint_categories'),
  },
  {
    type: 'path',
    initialPage: 1,
    routeName: 'Triage',
  },
  {
    type: 'item',
    initialPage: 1,
    name: 'Triage',
    routeName: 'Triage',
    t: i18n.t('menu:basic_measurements'),
  },
  {
    type: 'categorie',
    initialPage: 0,
    name: 'Tests',
    routeName: 'Tests',
    t: i18n.t('menu:tests'),
  },
  {
    type: 'categorie',
    initialPage: 0,
    name: 'DiagnosticsStrategy',
    routeName: 'DiagnosticsStrategy',
    t: i18n.t('menu:strategy'),
  },
];
