export const Config = {
  TEST_API_URL: 'https://liwi-test.wavelab.top/api/v1/',
  STAGING_API_URL: 'https://liwi.wavelab.top/api/v1/',
  PRODUCTION_API_URL: 'https://medalc.unisante.ch//api/v1',
  ENVIRONNEMENTS: [
    { label: 'Test', value: 'test' },
    { label: 'Staging', value: 'staging' },
    { label: 'Production', value: 'production' },
  ],
  LANGUAGES: [
    { label: 'English', value: 'en' },
    { label: 'Swahili', value: 'sw' },
    { label: 'Zulu', value: 'zu' },
  ],
  DEVICE_INFO: ['mac_address', 'name', 'model', 'brand', 'os', 'os_version'],
  HEALTH_FACILITY_INFO: ['architecture', 'area', 'country', 'name'],
}
