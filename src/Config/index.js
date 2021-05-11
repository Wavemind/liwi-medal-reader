export const Config = {
  TEST_API_URL: 'https://liwi-test.wavelab.top/api/v1/',
  STAGING_API_URL: 'https://liwi.wavelab.top/api/v1/',
  PRODUCTION_API_URL: 'https://medalc.unisante.ch//api/v1',
  PING_INTERVAL: 5000,
  ENVIRONNEMENTS: [
    { label: 'Test', value: 'test' },
    { label: 'Staging', value: 'staging' },
    { label: 'Production', value: 'production' },
  ],
  LANGUAGES: [
    { label: 'English', value: 'en' },
    { label: 'Swahili', value: 'sw' },
    { label: 'Français', value: 'fr' },
  ],
  DEVICE_INFO: ['mac_address', 'name', 'model', 'brand'],
  HEALTH_FACILITY_INFO: [
    'id',
    'architecture',
    'area',
    'country',
    'name',
    'main_data_ip',
    'local_data_ip',
  ],
  ALGORITHM_INFO: ['version_name', 'version_id', 'updated_at'],
}
