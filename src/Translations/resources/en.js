export default {
  actions: {
    select: 'Select',
    continue: 'Continue',
    login: 'Login',
    synchronize: 'Synchronize',
  },
  algorithm: {
    version_id: 'Version id',
    version_name: 'Version name',
    updated_at: 'Last update',
  },
  application: {
    theme: {
      dark_mode: 'Dark mode',
      light_mode: 'Light mode',
    },
  },
  containers: {
    auth: {
      login: {
        title: 'Connect to medAL-creator',
        email: 'Email',
        password: 'Password',
        environment: 'Environment',
      },
      synchronization: {
        title: 'Synchronize with medAL-creator',
        description:
          'An administrator will assign this device to your health facility',
      },
      pin: {
        unlock: 'Enter the PIN to unlock the tablet',
      },
    },
    settings: {
      general: {
        title: 'General',
        environment: 'Environment',
        app_languages: 'App Languages',
        algorithm_languages: 'Algorithm Languages',
      },
      algorithm: {
        title: 'Algorithm',
      },
      health_facility: {
        title: 'Health Facility',
      },
      device: {
        title: 'Device',
      },
    },
  },
  components: {
    modal: {
      study: {
        no_content:
          'No content is available. Please fill the study description in medAL-creator',
      },
    },
  },
  device: {
    name: 'Name',
    mac_address: 'MAC address',
    model: 'Model',
    brand: 'Brand',
    os: 'OS',
    os_version: 'OS Version',
    name_not_available: 'no name available',
  },
  health_facility: {
    name: 'Name',
    architecture: 'Architecture',
    country: 'Country',
    area: 'Area',
    local_data_ip: 'medAL-hub address',
    main_data_ip: 'medAL-data address',
    roles: {
      medical_doctor: 'Medical Doctor (MD)',
      assistant_medical_officer: 'Assistant Medical Officer (AMO)',
      clinical_officer: 'Clinical Officer (CO)',
      nurse: 'Nurse',
      midwife: 'Midwife',
      pharmacist: 'Pharmacist',
      registration_assistant: 'Registration assistant',
    },
  },
  navigation: {
    home: 'Home',
    settings: 'Settings',
  },
  permissions: {
    message: 'You must grant the relevant permissions for the app to function.',
    instructions:
      'Please go to Permissions in the tablet Settings and grant all required permissions',
  },
}
