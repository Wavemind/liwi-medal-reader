export default {
  actions: {
    continue: 'Continue',
    login: 'Login',
    new_patient: 'New patient',
    search: 'Search',
    select: 'Select',
    synchronize: 'Synchronize',
    clear_filters: 'Clear all filters',
    clear_selection: 'Clear selection',
    loading: 'Loading...',
    new_medical_case: 'New case',
    show_consent: 'Show consent',
    scan_consent: 'Scan new consent',
    add: 'Add',
    apply: 'Apply Selection',
    reset: 'Reset',
    save: 'Save',
  },
  algorithm: {
    version_id: 'Version id',
    version_name: 'Version name',
    json_version: 'Build version',
    updated_at: 'Last update',
  },
  application: {
    algorithm_translation_missing: 'Algorithm translation is missing',
    no_results: 'No results found',
    search: 'Search',
    theme: {
      dark_mode: 'Dark mode',
      light_mode: 'Light mode',
    },
  },
  answers: {
    yes: 'Yes',
    no: 'No',
    measured: 'Measured',
    estimated: 'Estimated',
  },
  containers: {
    auth: {
      login: {
        title: 'Connect to medAL-data',
        server_address: 'Server address',
        client_id: 'Device ID',
      },
      synchronize: {
        title: 'Synchronize with medAL-data',
      },
      pin: {
        unlock: 'Enter the PIN to unlock the tablet',
        delete: 'Delete',
      },
    },
    additional_list: {
      title: 'Select your {{ items }}',
    },
    filters: {
      title: 'Filters',
      patient_info: 'Patient information',
      others: 'Others',
    },
    home: {
      title: 'Latest consultations',
    },
    medical_case: {
      no_questions: 'No questions proposed',
      duration_title: 'duration in days',
      navigation: {
        back: 'Prev',
        next: 'Next',
      },
      list: {
        title: 'Consultations',
        name: 'Name',
        status: 'Status',
      },
      stages: {
        registration: 'Registration',
        first_assessments: 'Initial assessment',
        consultation: 'Consultation',
        assessments: 'Tests',
        diagnoses: 'Diagnoses',
        closed: 'Closed',
      },
      steps: {
        registration: 'Registration',
        unique_triage_questions: 'Potential emergencies',
        complaint_categories: 'Complaint categories',
        basic_measurements: 'Basic measurements',
        medical_history: 'Medical history',
        physical_exams: 'Physical exams',
        assessments: 'Tests',
        final_diagnoses: 'Final diagnoses',
        healthcare_questions: 'Treatment questions',
        medicines: 'Medicines',
        formulations: 'Formulations',
        summary: 'Summary',
        referral: 'Referral',
      },
      registration: {
        questions: 'Questions',
      },
      common: {
        agree: 'Agree',
        disagree: 'Disagree',
      },
      diagnoses: {
        diagnoses: 'Diagnoses',
        proposed_title: 'Diagnoses proposed',
        additional_title: 'Additional diagnoses selected',
        additional_placeholder: 'Select additional {{ item }}',
        multiple_diagnostics: 'diagnostics',
        multiple_drugs: 'drugs',
        custom_title: 'Manually added diagnoses',
        custom_placeholder: 'Add diagnoses manually',
        no_proposed: 'No diagnoses proposed',
        no_additional: 'No additional diagnoses selected',
        no_custom: 'No diagnoses added manually',
      },
      /* al 20210912 removed from diagnoses: proposed_title: 'Diagnoses proposed by {{ version_name }}', */
      drugs: {
        drugs: 'Drugs',
        proposed: 'Proposed',
        additional: 'Additional',
        custom: 'Added manually',
        custom_placeholder: 'Add your drugs',
        no_proposed: 'No drugs proposed',
        no_additional: 'No additional drugs selected',
        no_custom: 'No drugs added manually',
        no_medicines: 'No medicines available',
      },
      formulations: {
        title:
          'Which drug formulation is available and suited for your patient?',
      },
      summary: {
        date_consultation: 'Date of consultation',
        age_date_consultation: 'Age at time of consultation',
        type_of_consultation: 'Type of consultation',
        management_consulting: 'Managements & Counselling',
        no_managements: 'No managements available',
      },
      summary_wrapper: {
        patient_uuid: 'Patient UUID',
        consultation_id: 'Consultation ID',
      },
    },
    scan: {
      scan: 'Scan the QR code',
      new: 'You need to generate a new sticker',
      new_sticker_notification:
        'You need to give another sticker to the patient',
      new_sticker_wrong_facility:
        'The new sticker does not belong to your facility',
      wrong_format: 'The QR code does not have the correct format',
    },
    patient: {
      list: {
        title: 'Patient list',
        name: 'Name',
        last_visit: 'Last visit',
        status: 'Status',
        no_active_consultations: 'No active consultations',
      },
      consultations: {
        current_consultation: 'Current consultation',
        last_consultations: 'Last consultations',
      },
      personal_info: {
        patient_info: 'Patient information',
        consultations_info: 'Registration data',
      },
    },
    consent: {
      list: {
        title: 'Consent files',
      },
    },
    synchronization: {
      not_synchronized: 'Medical cases not synchronized yet',
      synchronize: 'Synchronize',
      warning: 'You have not synchronized for over 7 days',
    },
    settings: {
      general: {
        title: 'General',
        environment: 'Environment',
        app_languages: 'App language',
        algorithm_languages: 'Algorithm language',
        app_version: 'App version',
        languages: {
          en: 'English',
          fr: 'Français',
        },
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
    consent: {
      title: 'Consent',
      question: 'Consent to data processing for this visit (No if revoked)',
    },
    date: {
      days: 'Day',
      months: 'Month',
      years: 'Year',
      estimated: {
        days: 'In days',
        months: 'In months',
        years: 'In years',
      },
      title: 'Select date',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    medical_case_drawer: {
      current_medical_case: 'Current consultation',
    },
    summary: {
      no_questions: 'No questions asked at this step',
      no_comments: 'No comments ',
    },
    modals: {
      lock: {
        title: 'Consultation not available',
        content: 'Case is locked by {{ name }}',
        unlock_button: 'FORCE UNLOCK',
        summary_button: 'SUMMARY',
      },
      emergency: {
        title: 'Emergency Assistance',
        content:
          'The patient is presenting a severe/emergency symptom or sign. Click on the emergency button if the child needs emergency care now.',
        emergencyButton: 'GO TO EMERGENCY',
      },
      exit_medical_case: {
        title: 'Leave consultation',
        content: 'You are leaving the consultation',
        exit_and_save: 'Exit & save',
        exit_without_save: "Exit, don't save",
      },
      exit_app: {
        title: 'Leave app',
        content: 'Do you really want to leave the app?',
        ok: 'OK',
        back: 'Cancel',
      },
      study: {
        no_content: 'No content',
      },
    },
    media: {
      file_not_supported: 'File not supported',
    },
  },
  device: {
    name: 'Name',
    device_id: 'ID',
  },
  database: {
    success: {
      message: 'Save',
      description: 'Consultation saved successfully',
    },
    error: {
      message: 'Error',
      description: 'An error occurred while saving the consultation',
    },
    createMedicalCaseError: {
      message: 'Error',
      description: 'An error occurred while creating the consultation',
    },
    patientLoadError: {
      message: 'Error',
      description: 'An error occurred while loading the patient',
    },
  },
  errors: {
    offline: {
      title: 'Communication error with {{ serverName }}',
      description: 'Server not accessible',
    },
    unknown: {
      title: 'Communication error',
      description: 'An unknown error occurred',
    },
    timeout: 'Server connection aborted',
  },
  health_facility: {
    id: 'ID',
    name: 'Name',
    architecture: 'Architecture',
    country: 'Country',
    area: 'Area',
    local_data_ip: 'medAL-hub address',
    main_data_ip: 'medAL-data address',
    custom_clinician: 'Missing staff member',
    custom_clinician_subtitle: 'Add temporary user',
    roles: {
      title: 'Roles',
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
    personal_info: 'Personal information',
    summary: 'Summary',
    final_diagnoses: 'Final Diagnoses',
    questions: 'Questions',
    consent_list: 'Consent files',
    current_consultation: 'Current consultation',
    home: 'Home',
    synchronization: 'Synchronization',
    welcome: 'Welcome',
    settings: 'Settings',
    about: 'About',
    synchronize: 'Synchronize',
    logout: 'Logout',
  },
  patient: {
    first_name: 'First name',
    last_name: 'Last name',
    birth_date: 'Date of Birth',
    gender: 'Gender',
    estimated_age: 'Estimated age',
    reason: 'Reason for changing facility',
    readable_birth_date: {
      days: '{{value}} days old',
      weeks: '{{value}} weeks old',
      months: '{{value}} months old',
      years: '{{value}} years old',
    },
  },
  medical_case: {
    comment: 'Comment',
  },
  permissions: {
    message: 'You must grant the relevant permissions for the app to work.',
    instructions:
      'Please go to Permissions in the tablet Settings and grant all required permissions',
  },
  formulations: {
    drug: {
      give: 'Give',
      mg: 'mg',
      caps: 'capsule(s) of',
      every: 'every',
      h: 'hour(s) for',
      hour: 'hour(s)',
      days: 'day(s)',
      mode: 'Mode',
      tablet: 'tablet of',
      d: 'duration',
      during: 'during',
      pre_referral: 'pre-referral',
      admin: 'Administration',
      ml: 'ml',
      of: 'of',
      tablets: 'tablet(s)',
      capsules: 'capsule(s)',
      inhaler: 'inhalation(s)',
      patch: 'patch(es)',
      spray: 'spray(s)',
      pessary: 'pessary(ies)',
      no_formulation: ' No formulation selected',
      missing_medicine_formulation: 'Please select a medicine formulation',
      no_options: 'No compatible option',
      medication_form_not_handled: 'Medication form not managed',
    },
    medication_form: {
      tablet: 'Tablet',
      dispersible_tablet: 'Dispersible tablet',
      capsule: 'Capsule',
      syrup: 'Syrup',
      suspension: 'Suspension',
      suppository: 'Suppository',
      drops: 'Drops',
      solution: 'Solution',
      powder_for_injection: 'Powder for injection',
      patch: 'Patch',
      cream: 'Cream',
      lotion: 'Lotion',
      pessary: 'Pessary',
      ointment: 'Ointment',
      gel: 'Gel',
      spray: 'Spray',
      inhaler: 'Inhaler',
      per: 'per',
      per_administration: 'per administration',
      per_application: 'application(s) per administration',
    },
  },
  reference_table: {
    above: '{{number}} or above',
    lower: '{{number}} or lower',
    between: 'Between {{number_1}} and {{number_2}}',
  },
  validation: {
    is_required: 'Field "{{ field }}" is mandatory',
    consent_file_blank: "The data processing consent can't be blank",
    final_diagnoses_required: 'Please agree or refuse all proposed diagnoses',
    medicines_required: 'Please agree or refuse all medicines',
    formulation_required: 'Please choose a formulation for each medicine',
  },
}
