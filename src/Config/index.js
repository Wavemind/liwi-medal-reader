export const Config = {
  ALGORITHM_INFO: ['version_name', 'version_id', 'updated_at'],
  DEVICE_INFO: ['mac_address', 'name', 'model', 'brand'],
  DATABASE_INTERFACE: {
    local: 'local',
    remote: 'remote',
  },
  DISPLAY_FORMAT: {
    radioButton: 'RadioButton',
    input: 'Input',
    dropDownList: 'DropDownList',
    formula: 'Formula',
    reference: 'Reference', // table reference
    string: 'String',
    autocomplete: 'Autocomplete',
    date: 'Date',
  },
  ENVIRONNEMENTS: [
    { label: 'Test', value: 'test' },
    { label: 'Staging', value: 'staging' },
    { label: 'Production', value: 'production' },
  ],
  HEALTH_FACILITY_INFO: [
    'id',
    'architecture',
    'area',
    'country',
    'name',
    'main_data_ip',
    'local_data_ip',
  ],
  LANGUAGES: [
    { label: 'English', value: 'en' },
    { label: 'Swahili', value: 'sw' },
    { label: 'Français', value: 'fr' },
  ],
  MEDICAL_CASE_STATUS: {
    inCreation: { label: 'in_creation' },
    waitingTriage: { label: 'waiting_triage' }, // TODO maybe to kick out
    triage: { label: 'triage' },
    waitingConsultation: { label: 'waiting_consultation' }, // TODO maybe to kick out
    consultation: { label: 'consultation' },
    waitingTests: { label: 'waiting_tests' }, // TODO maybe to kick out
    tests: { label: 'tests' },
    waitingDiagnostic: { label: 'waiting_diagnostic' }, // TODO maybe to kick out
    finalDiagnostic: { label: 'final_diagnostic' },
    close: { label: 'close' },
  },

  URL_PRODUCTION_API: 'https://medalc.unisante.ch//api/v1',
  URL_STAGING_API: 'https://liwi.wavelab.top/api/v1/',
  URL_TEST_API: 'https://liwi-test.wavelab.top/api/v1/',
}
