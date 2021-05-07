export default {
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
    mac_address: 'Mac address',
    name_not_available: 'no name available',
  },
  health_facility: {
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
  permissions: {
    message: 'You must grant the relevant permissions for the app to function.',
    instructions:
      'Please go to Permissions in the tablet Settings and grant all required permissions',
  },
  actions: {
    select: 'Select',
    continue: 'Continue',
    login: 'Login',
    synchronize: 'Synchronize',
  },
}
