export default {
  actions: {
    continue: 'Continue',
    login: 'Login',
    search: 'Search',
    select: 'Select',
    synchronize: 'Synchronize',
  },
  algorithm: {
    version_id: 'Version id',
    version_name: 'Version name',
    json_version: 'Build version',
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
        delete: 'Delete',
      },
    },
    home: {
      title: 'Latest consultations',
    },
    scan: {
      scan: 'Scan the QR code',
      new: 'You need to generate a new sticker',
      new_sticker_notification:
        'You need to give another sticker to the patient',
      new_sticker_wrong_facility:
        'The new sticker does not belong to your facility',
    },
    settings: {
      general: {
        title: 'General',
        environment: 'Environment',
        app_languages: 'App languages',
        algorithm_languages: 'Algorithm languages',
      },
      algorithm: {
        title: 'Algorithm',
      },
      health_facility: {
        title: 'Health facility',
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
    id: 'ID',
    name: 'Name',
    architecture: 'Architecture',
    country: 'Country',
    area: 'Area',
    local_data_ip: 'MedAL-hub address',
    main_data_ip: 'MedAL-data address',
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
    scan_qr_code: 'Scan QR code',
    consultations: 'Consultations',
    patient_list: 'Patient list',
    consent_files: 'Consent files',
    current_consultation: 'Current consultation',
    home: 'Home',
    welcome: 'Welcome {{ clinician }}',
    settings: 'Settings',
    about: 'About',
    synchronize: 'Synchronize',
    logout: 'Logout',
  },
  permissions: {
    message: 'You must grant the relevant permissions for the app to function.',
    instructions:
      'Please go to Permissions in the tablet Settings and grant all required permissions',
  },
}
