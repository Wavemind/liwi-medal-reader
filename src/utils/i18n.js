import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import { NativeModules } from 'react-native';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    const deviceLocale = NativeModules.I18nManager.localeIdentifier;
    callback(deviceLocale);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        application: {
          loading: 'Loading...',
          no_data: 'No data available',
          date_format: 'DD/MM/YYYY',
          select: 'Select',
          save: 'Save',
          resource_not_available: 'No connection, resource not available',
          server_error: 'Server error',
        },
        consent_image: {
          scan: 'Scan consent',
          show: 'Show consent',
          title: 'Consent',
          label: 'Consent to data processing for this visit. NO if revoked',
          required: "The data processing consent can't be blank",
        },
        diagnoses: {
          add: 'Create',
          add_medicine: 'Additional Medicines',
          duration_in_days: 'Duration in days',
          add_drugs: 'Add drugs',
          add_managements: 'Add management',
          additional_drugs: 'Drugs',
          additional_managements: 'Managements',
          additional: 'Do you want to add additional diagnoses not proposed?',
          additional_arm_control: 'Add diagnoses',
          agree: 'Agree',
          close: 'Close',
          custom: 'Do you want to manually add other diagnoses not proposed?',
          custom_duration: 'Custom duration',
          disagree: 'Disagree',
          duration: 'duration',
          list: 'List of diagnoses',
          manually_medicine: 'Medicines for the Additional Diagnoses',
          management: 'Management & Counselling',
          medicine: 'Medicine',
          medicines: 'Medicines',
          no_drugs: 'No drugs proposed',
          drugs: 'Drugs',
          formulation_mandatory: 'You must choose a formulation in order to get the recommended prescription(s)',
          medicine_mandatory: 'You must agree or disagree to drugs in order to get the recommended prescription(s)',
          managements: 'Managements',
          none: 'none',
          proposed: 'Diagnoses proposed by',
          no_proposed: 'No diagnoses proposed',
          search: 'Search by name',
          select: '  Please select...', // Keep the space at the begin of string
          sum: 'Summary Treatment',
          title_additional: 'Additional selected',
          title_additional_arm_control: 'Diagnoses selected',
          no_additional: 'No additional diagnosis',
          no_additional_arm_control: 'No diagnosis selected',
          no_additional_drugs: 'No additional drugs',
          no_additional_managements: 'No additional managements',
          no_medicines: 'No medicines available',
          no_managements: 'No managements available',
          weight: 'weight',
          which: 'Which formulation of medicine is available and appropriate for your patient?',
          write: 'Enter additional medicine',
          consultation_comment: 'You may add further clinical details for your records if you wish (Non-mandatory. Will not be used in the algorithm)',
        },
        drug: {
          give: 'Give',
          mg: 'mg',
          caps: 'capsule of',
          every: 'every',
          h: 'hours for',
          days: 'days',
          mode: 'Mode',
          tablet: 'tablet of',
          d: 'duration',
          during: 'during',
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
          medication_form_not_handled: 'Medication form not handled',
        },
        medication_form: {
          tablet: 'Tablet',
          capsul: 'Capsule',
          syrup: 'Syrup',
          suspension: 'Suspension',
          suppository: 'Suppository',
          drops: 'Drops',
          solution: 'Solution',
          powder_for_injection: 'Powder for injection',
          patch: 'Patch',
          cream: 'Cream',
          pessary: 'Pessary',
          ointment: 'Ointment',
          gel: 'Gel',
          spray: 'Spray',
          inhaler: 'Inhaler',
          per: 'per',
          per_administration: 'per administration',
        },
        media: {
          file_not_supported: 'File not supported',
          audio_error: 'An error occured with the audio file',
        },
        diagnoses_label: {
          additional: 'Additional',
          additionalDrugs: 'Additional drugs',
          custom: 'Custom',
          customDrugs: 'Custom drugs',
          proposed: 'Proposed',
        },
        modal: {
          invalidQuestions: 'Question(s) to fill',
          close: 'Close',
          notcomplete: 'Is not complete!',
          more: '...',
          uncompleted: 'Stage not valid',
          patientnotcomplete: 'The creation of the patient',
          is_required: 'is required',
          medicalCaseAlreadyUsed: 'Consultationnot available',
        },
        algorithms: {
          never: 'Never synchronized data',
          last: 'Last synchronization attempt',
          success: 'Synchronization successful',
          nosuccess: 'The synchronization didn\'t work. ',
          titlesync: 'Synchronization status of consultations',
          synchronize: 'Synchronize cases',
          no: 'Never synchronized',
          need: 'Must be re-synchronized',
          uptdate: 'Synchronized',
        },
        confirm: {
          message: 'Do you want to close the current consultation and create new one?',
          new: 'Create new case',
          continue: 'Continue creating case',
        },
        emergency: {
          title: 'Emergency assistance',
          description: 'This page has been created to provide emergency assistance in case of need',
          description_warning: 'The patient is presenting a severe/emergency symptom or sign. Click on the emergency button if the child needs emergency care now',
          go_to_emergency: 'Go to emergency',
          back: 'Back to home',
        },
        qrcode: {
          scan: 'Scan the QR code',
          new: 'You need to generate a new sticker',
          open: 'Successful QR Code scanning. Opening Patient',
          new_sticker_notification: 'You need to give another sticker to the patient',
          new_sticker_wrong_facility: 'The new sticker does not belong to your facility',
        },
        summary: {
          diagnoses: 'Diagnoses',
          questions: 'Variables',
        },
        assessment: {
          title: 'First look assessment',
        },
        consultation: {
          medical_history: 'Medical history',
          physical_exam: 'Physical exam',
          comment: 'Comment',
        },
        triage: {
          unique_triage_questions: 'Unique triage questions',
          basic_measurement: 'Basic measurements',
          chronical_condition: 'Chronic conditions',
          other: 'Others',
          chief: 'Complaint categories',
          not_allowed: 'You have to answer all chief complaints',
        },
        form: {
          required: ' is required',
          save: 'Save',
          edit: 'Edit',
          back: 'Back',
          next: 'Next',
          next_stage: 'Next stage',
        },
        question: {
          yes: 'Yes',
          no: 'No',
          measured: 'Measured',
          estimated: 'Estimated',
          unavailable: 'Unavailable',
        },
        menu: {
          patientUpsert: 'Registration',
          triage: '1st assessment',
          unique_triage_questions: 'Unique triage questions',
          basic_measurements: 'Basic measurements',
          chronical_conditions: 'Comorbidités',
          complaint_categories: 'Types de plainte',
          consultation: 'Consultation',
          medical_history: 'Antécédents',
          physical_exam: 'Physical exam',
          consent_list: 'Consent files',
          comment: 'Comment',
          poct: 'POCT',
          tests: 'Tests',
          strategy: 'Diagnoses',
          search: 'Search a patient',
          add: 'Add a patient',
          others: 'Others',
          noredux: 'No consultation loaded',
        },
        comment: {
          save: 'Save comment',
          edit: 'Edit comment',
        },
        medical_case: {
          in_creation: 'Demographic',
          conditions: 'Treatment Conditions',
          medicines: 'Medicines',
          medicines_formulation: 'Medicine Formulations',
          final_diagnoses: 'Diagnoses',
          healthcares_questions: 'Management questions',
          healthcares: 'Treatments & Management',
          referral: 'Referral',
          reset_stage: 'Reset questions',
          managements: 'Managements',
          treatments: 'Treatments',
          waiting_triage: 'Waiting for 1st assessment',
          triage: '1st assessment',
          waiting_consultation: 'Waiting for consultation',
          consultation: 'Consultation',
          waiting_tests: 'Waiting for test',
          tests: 'Tests',
          waiting_diagnostic: 'Waiting for diagnostic',
          waiting_final_diagnostic: 'Wait for diagnosis',
          final_diagnostic: 'Diagnosis',
          close: 'Closed',
          finish: 'FINISH & CLOSE',
          next: 'NEXT',
          back: 'BACK',
        },
        settings: {
          devices: 'Medical devices',
          tests: 'Medical tests available',
          awake: 'Keep awake',
          production: 'Serveur de production',
          app: 'Application',
          version: 'Version',
          environment: 'Environment',
          generate_cases: 'Generate Medical Cases',
        },
        work_case: {
          create: 'New case',
          medical_case: 'Consultation',
          medical_cases: 'Consultations',
          no_medical_cases: 'No consultations',
          no_algorithm: 'No algorithm loaded',
          no_questions: 'No tests or assessments proposed',
          no_conditions: 'No treatments conditions in this case. Please continue.',
        },
        patient_detail: {},
        patient_list: {
          add: 'Add patient',
          all: 'All',
          waiting: 'Patients waiting for',
          search: 'Search',
          sort: 'Sort by',
          name: 'First name',
          surname: 'Last name',
          status: 'Status',
          no_patients: 'There is no patient',
          not_found: 'No match found',
          waiting_triage: '1st assessment',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnostics: 'Diagnosis',
          case_in_progress: 'a case is open',
        },
        patient_summary_menu: {
          patient_profile: 'Patient profile',
          current_summary: 'Current summary',
          differential_diagnoses: 'Differential diagnoses',
        },
        patient_profile: {
          personal_information: 'Personal information',
          medical_cases: 'Consultations',
          date: 'Last visit',
          status: 'Status',
          add_case: 'Add consultation',
          edit_patient_value: 'Edit patient values',
        },
        patient_edit: {
          show_consent: 'Show consent file',
        },
        patient_upsert: {
          too_young: "This algorithm cannot manage children below {{age_in_days}} day(s) of age. The consultation cannot continue with this date of birth",
          too_old: "This algorithm cannot manage children above {{age_in_days}} day(s) of age. The consultation cannot continue with this date of birth",
          uid: 'UID',
          study_id: 'Study ID',
          group_id: 'Health Facility ID',
          other_uid: 'Other UID',
          other_study_id: 'Other study ID',
          other_group_id: 'Other HF ID',
          facility: 'Facility data',
          questions: 'Questions',
          title: 'Patient',
          save_and_wait: 'Save + add to waiting list',
          save_and_case: 'Save + create new case',
          save: 'Save',
          permission_button_negative: 'Cancel',
          permission_button_positive: 'Ok',
          permission_message: 'We need your permission to use your camera',
          permission_title: 'Permission to use camera'
        },
        medical_case_list: {
          all: 'All',
          waiting: 'Patients waiting for',
          search: 'Search',
          sort: 'Sort by',
          name: 'First name',
          surname: 'Last name',
          status: 'Status',
          no_medical_cases: 'There is no consultation in progress',
          not_found: 'No match found',
          waiting_triage: '1st assessment',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnostic: 'Diagnosis',
        },
        patient: {
          first_name: 'First name *',
          last_name: 'Last name *',
          birth_date: 'Day of birth',
          gender: 'Gender *',
          male: 'Male',
          female: 'Female',
          age_not_defined: 'Age is not defined',
          reason: 'Reason for changing facility',
          day: 'Day',
          month: 'Month',
          year: 'Year *',
        },
        login: {
          title: 'Login',
          welcome: 'Welcome',
          add_account: 'Add an account',
          send_device_info: 'Send device data',
          clear_sessions: 'Delete sessions',
          error_char: 'At least 6 characters',
          error_letter: 'At least one letter and one number',
          email: 'Email',
          password: 'Password',
          connect: 'Login',
        },
        code_session_screen: {
          title: 'Welcome',
          your_code: 'Your code',
          set_code: 'Set code',
          type_your_code: 'Retype the code',
          error_char: 'Minimum 6 characters',
          error_same: 'The code must be the same',
          error_letter: 'At least one letter and one number',
        },
        basic_measurements: {
          temperature: 'Temperature',
          heart_rate: 'Heart rate',
          height: 'Height',
          weight: 'Weight',
          respiratory_rate: 'Respiratory rate',
        },
        new_session: {
          title: 'Connect to medAL-creator',
          unlock_session: 'Local login',
          connect: 'Login',
        },
        unlock_session: {
          who: 'Who are you?',
          fill: 'Fill the missing information as guest',
          pin: 'Enter the PIN to unlock the tablet',
          current_user: 'Currently logged in as',
          email: 'Email',
          assign: 'An administrator will assign this device to your health facility',
          code: 'Code',
          unlock: 'Login',
          title: 'Sync with medAL-creator',
          new_session: 'Create new session',
          sync_group: 'Synchronize',
          logout: 'logout',
          role: 'Role',
        },
        popup: {
          startSave: 'Save consultation',
          saveSuccess: 'Successfully saved',
          unlock: 'Force unlock',
          close: 'Close',
          desc: 'Description',
          version_name: 'version',
          version: 'Update of version',
          title: 'Please allow access to the position',
          message: 'Location sharing is necessary in order to use the medical service',
          ask_me_later: 'Ask me later',
          cancel: 'cancel',
          ok: 'Ok',
          by: 'by',
          summary: 'Summary',
          isLocked: 'Case is locked',
          at: 'at',
        },
        sessions: {
          active: 'Sessions active',
          empty: 'No session',
        },
        home: {
          title: 'Home',
        },
        navigation: {
          medical_case_list: 'Consultations',
          home: 'Home',
          triage: '1st assessment',
          patient_upsert: 'Patient',
          patient_edit: 'Patient edit',
          patient_list: 'Patient list',
          patient_search: 'Search a patient',
          patient_profile: 'Patient profile',
          synchronize: 'Synchronize',
          patient_add: 'New patient',
          patient_qr: 'Scan QR code',
          settings: 'Settings',
          my_profile: 'My profile',
          logout: 'Logout',
          synchronization: 'Synchronization',
          emergency: 'Emergency',
          diagnosticsstrategy: 'Diagnoses',
          conditions: 'Treatment Conditions',
          filter: 'Filters',
          step_invalid: 'Step not valid. Please complete all of the mandatory fields',
          about: 'About',
          consent_list: "Facility's consent files",
          qr_reader: 'Scanner',
        },
        common: {
          back: 'Back',
          disconnect: 'Disconnect',
          consultation: 'Consultation',
          patient_data: 'Patient',
          continue: 'Continue',
          page_content: 'Page content',
        },
        filters: {
          title: 'Filters',
          clear: 'Clear all',
          apply: 'Apply',
          status: 'Status',
        },
        notifications: {
          empty_code: 'Your code is empty, please write it',
          invalid_code: ' Your local code is invalid, please try again',
          session_does_not_exist: 'Your local user does not exist, please try again',
          session_already_exist: 'Session already exists',
          no_internet: 'You have no internet connection',
          connection_successful: 'Connection successful',
          algorithm_updated: 'Your algorithm has been updated',
          get_group: 'Receiving group data and medical staff',
          device_registered: 'Device registered',
        },
        synchronize: {
          title: 'Consultations to synchronize',
          synchronize: 'Synchronize',
          not_warning: 'Consultations have not been synchronised for more than 1 week',
          main_data_address_missing: 'medAL-data URL missing in health facility configuration',
          error: 'An error occurred on the medAL-data server',
        },
      },
      fr: {
        application: {
          loading: 'Chargement en cours...',
          no_data: 'Aucune donnée disponible',
          date_format: 'DD/MM/YYYY',
          select: 'Choisir',
          save: 'Enregistrer',
          resource_not_available: 'Erreur de connexion. Resource indisponible',
          server_error: 'Erreur serveur',
        },
        consent_image: {
          scan: 'Scanner consentement',
          show: 'Voir consentement',
          title: 'Consentement',
          label: 'Consentir au traitement de données pour cette visite ?',
          required: "Le consentement au traitement des données ne peut être ignoré",
        },
        diagnoses: {
          add: 'Créer',
          add_medicine: 'Médicaments supplémentaires',
          duration_in_days: 'Durée en jours',
          add_drugs: 'Ajouter médicament(s)',
          add_managements: 'ajouter ',
          additional_drugs: 'Médicaments',
          additional_managements: 'Prises en charges',
          additional: 'Ajouter un des diagnostics non-proposés ?',
          agree: 'Accepter',
          close: 'Fermer',
          custom: 'Ajouter manuellement d0autres diagnostics non-proposés ?',
          custom_duration: 'Durée personnalisée',
          disagree: 'Rejeter',
          duration: 'Durée',
          list: 'Liste de diagnostics',
          manually_medicine: 'Médicaments pour les diagnostics ajoutés',
          management: 'PRise en charge et conseil',
          medicine: 'Médicament',
          medicines: 'Médicaments',
          no_drugs: 'Aucun médicament proposé',
          drugs: 'Médicaments',
          managements: 'Prises en charge',
          none: 'aucun',
          proposed: 'Diagnostics proposés par',
          no_proposed: 'Aucun diagnostic proposé',
          search: 'Chercher par nom',
          select: '  Choisir...', // Keep the space at the begin of string
          sum: 'Résumé',
          title_additional: 'Supplémentaire (sélectionné)',
          no_additional: 'Pas de diagnotic ajouté',
          no_additional_drugs: 'Pas de médicament ajouté',
          no_additional_managements: 'Pas de prise en charge ajoutée',
          no_medicines: 'Aucun médicament disponible',
          no_managements: 'Aucune prise en charge disponible',
          weight: 'poids',
          which: 'Quelle formulation est disponible et appropriée pour votre patient ?',
          write: 'Saisir médicament ajouté',
          consultation_comment: 'Vous pouvez indiquer les détails cliniques pour vos archives si souhaité (Pas obligatoire. Pas utilisé dans l\'algorithme)',
          medicine_mandatory: 'Vous devez accepter ou rejeter les médicaments proposés pour aboutir à la bonne prescription',
          formulation_mandatory: 'Vous devez choisir la bonne formulation pour aboutir à la bonne prescription',
        },
        drug: {
          give: 'Donner',
          mg: 'mg',
          caps: 'capsule de',
          every: 'toute les',
          h: 'heures durant',
          days: 'Jours',
          mode: 'Mode',
          tablet: 'tablette de',
          d: 'durée',
          during: 'pendant',
          admin: 'Administration',
          ml: 'ml',
          of: 'de',
          tablets: 'tablette(s)',
          capsules: 'capsule(s)',
          inhaler: 'inhalation(s)',
          patch: 'patch(es)',
          spray: 'spray(s)',
          pessary: 'pessaire(s) (éponge(s))',
          no_formulation: ' Aucune formulation choisie',
          missing_medicine_formulation: 'Choisir la formulation du médicament',
          no_options: 'Aucune option compatible',
          medication_form_not_handled: 'Forme d\'administration non-prise en charge',
        },
        medication_form: {
          tablet: 'Tablette',
          capsul: 'Capsule',
          syrup: 'Syrop',
          suspension: 'Suspension',
          suppository: 'Suppositoire',
          drops: 'Gouttes',
          solution: 'Solution',
          powder_for_injection: 'Poudre pour injection',
          patch: 'Patch',
          cream: 'Crème',
          pessary: 'Pessaire (éponge)',
          ointment: 'Onguent',
          gel: 'Gel',
          spray: 'Spray',
          inhaler: 'Inhalateur',
          per: 'par',
          per_administration: 'par administration',
        },
        media: {
          file_not_supported: 'Format de fichier non-pris en charge',
          audio_error: 'Erreur dans la lecture du fichier audio',
        },
        diagnoses_label: {
          additional: 'Supplémentaire',
          additionalDrugs: 'Médicaments supplémentaires',
          custom: 'Personnalisé',
          customDrugs: 'Médicaments personnalisés',
          proposed: 'proposés',
        },
        modal: {
          invalidQuestions: 'Question(s) à compléter',
          close: 'Fermer',
          notcomplete: 'Incomplet!',
          more: '...',
          uncompleted: 'Phase invalide',
          patientnotcomplete: 'La création du / de la patient(e)',
          is_required: 'is nécessaire',
          medicalCaseAlreadyUsed: 'Consultation non-disponible',
        },
        algorithms: {
          never: 'Données jamais synchronisées',
          last: 'Dernière tentative de synchronisation',
          success: 'Syncrhonisation réussie',
          nosuccess: 'la synchronisation n\'a pas abouti. ',
          titlesync: 'Statut de la syncrhnosation des consultations',
          synchronize: 'Cas syncrhonisés',
          no: 'Jamais syncrhonisé',
          need: 'Doit être re-syncrhonisé',
          uptdate: 'Synchronisé',
        },
        confirm: {
          message: 'Voulez-vous fermer la consultation en cours en commencer une nouvelle ?',
          new: 'Créer une nouvelle consultation',
          continue: 'Poursuivre la création de la consultation',
        },
        emergency: {
          title: 'Urgence',
          description: 'Cette page a été créée pour fournir de l\'assistance en cas d\'urgence',
          description_warning: 'Le patient présente des signes ou symptomes sévères ou urgents. Cliquez sur le bouton d\'urgence maintenant',
          go_to_emergency: 'Voir la page d\'urgences',
          back: 'Retour à l\'accueil',
        },
        qrcode: {
          scan: 'Scanner le code QR',
          new: 'Veuillez fournir une nouvelle étiquette au patient',
          open: 'Code QR lu. Ouverture du patient',
          new_sticker_notification: 'Veuillez fournir une nouvelle étiquette au patient',
          new_sticker_wrong_facility: 'La nouvelle étiquette ne correspond pas à ce centre de santé',
        },
        summary: {
          diagnoses: 'Diagnostics',
          questions: 'Variables',
        },
        assessment: {
          title: 'Examen initial',
        },
        consultation: {
          medical_history: 'Antécédents médicaux',
          physical_exam: 'Examen médical',
          comment: 'Commentaire',
        },
        triage: {
          unique_triage_questions: 'Questions uniques de triage',
          basic_measurement: 'prise de mesures',
          chronical_condition: 'Comorbidités',
          other: 'Autres',
          chief: 'Types de plainte',
          not_allowed: 'Vous devez répondre à tous les types de plainte',
        },
        form: {
          required: ' est obligatoire',
          save: 'Enregistrer',
          edit: 'Modifier',
          back: 'Retour',
          next: 'Suivant',
          next_stage: 'Prochaine phase',
        },
        question: {
          yes: 'Oui',
          no: 'Non',
          measured: 'Mesuré',
          estimated: 'Estimé',
          unavailable: 'Pas disponible',
        },
        menu: {
          patientUpsert: 'Admission',
          triage: 'Examen initial',
          unique_triage_questions: 'Questions uniques de triage',
          basic_measurements: 'Prise de mesures',
          chronical_conditions: 'Comorbidités',
          complaint_categories: 'Types de plainte',
          consultation: 'Consultation',
          medical_history: 'Antécédents',
          physical_exam: 'Examen médical',
          consent_list: 'Formulaires de consentement',
          comment: 'Commentaire',
          poct: 'POCT',
          tests: 'Tests',
          strategy: 'Diagnostics',
          search: 'Chercher patient(e)',
          add: 'Ajouter patient(e)',
          others: 'Autres',
          noredux: 'Aucune consultation chargée',
        },
        comment: {
          save: 'Enregistrer commentaire',
          edit: 'Modifier commentaire',
        },
        medical_case: {
          in_creation: 'Infos démographiques',
          conditions: 'Conditions de traitement',
          medicines: 'Médicaments',
          medicines_formulation: 'Formulations',
          final_diagnoses: 'Diagnostics',
          healthcares_questions: 'Questions relatives à la prise en charge',
          healthcares: 'Traitements en prise en charge',
          referral: 'Orientation',
          reset_stage: 'RàZ questions',
          managements: 'Prises en charge',
          treatments: 'Traitements',
          waiting_triage: 'En attente d\'examen initial',
          triage: 'Examen initial',
          waiting_consultation: 'En attente de consultation',
          consultation: 'Consultation',
          waiting_tests: 'En attente de tests',
          tests: 'Tests',
          waiting_diagnostic: 'En attente de diagnostic',
          waiting_final_diagnostic: 'En attente de diagnostic final',
          final_diagnostic: 'Diagnostic(s)',
          close: 'Fermé',
          finish: 'FINIR & FERMER',
          next: 'SUIVANT',
          back: 'RETOUR',
        },
        settings: {
          devices: 'Appareils médicaux',
          tests: 'Tests médicaux disponibles',
          awake: 'Maintenir allumé',
          production: 'Serveur de production',
          app: 'Application',
          version: 'Version',
          environment: 'Environnement',
          generate_cases: 'Créer des consultations (test)',
        },
        work_case: {
          create: 'Nouvelle consultation',
          medical_case: 'Consultation',
          medical_cases: 'Consultations',
          no_medical_cases: 'Aucune consultation',
          no_algorithm: 'Aucun algorithme chargé',
          no_questions: 'Aucun test proposé',
          no_conditions: 'Pas de conditions de traitement dans ce cas. Veuillez continuer.',
        },
        patient_detail: {},
        patient_list: {
          add: 'Ajouter patient(e)',
          all: 'Tous',
          waiting: 'Patient(s) en attente pour',
          search: 'Rechercher',
          sort: 'Trier',
          name: 'Prénom',
          surname: 'Nom de famille',
          status: 'Statut',
          no_patients: 'Aucun(e) patient(e)',
          not_found: 'Aucun enregistrement trouvé',
          waiting_triage: 'Examen initial',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnostics: 'Diagnostic',
          case_in_progress: 'consultation en cours',
        },
        patient_summary_menu: {
          patient_profile: 'Profil patient(e)',
          current_summary: 'Résumé',
          differential_diagnoses: 'Diagnostics différentiels',
        },
        patient_profile: {
          personal_information: 'Informations personnelles',
          medical_cases: 'Consultations',
          date: 'Dernière visite',
          status: 'Statut',
          add_case: 'Ajouter consultation',
          edit_patient_value: 'Modifier valeurs patient(e)',
        },
        patient_edit: {
          show_consent: 'Voir consentements',
        },
        patient_upsert: {
          too_young: "Cet algorithme ne peut pas prendre en charge en charge les enfants de moins de {{age_in_days}} jour(s). Fin de la consultation.",
          too_old: "Cet algorithme ne peut pas prendre en charge en charge les enfants de plus de {{age_in_days}} jour(s). Fin de la consultation.",
          uid: 'ID du patient',
          study_id: 'ID de l\'étude',
          group_id: 'ID du centre de santé',
          other_uid: 'Autre ID de patient',
          other_study_id: 'Autre ID d\'étude',
          other_group_id: 'Autre ID de centre de santé',
          facility: 'Données du centre de santé',
          questions: 'Questions',
          title: 'Patient(e)',
          save_and_wait: 'Enregistrer + ajouter à la liste d\'attente',
          save_and_case: 'Enregistrer + ouvrir consultation',
          save: 'Enregistrer',
          permission_button_negative: 'Annuler',
          permission_button_positive: 'Ok',
          permission_message: 'Nous avons besoin de votre permission pour utiliser l\'appareil photo',
          permission_title: 'Permission appareil photo'
        },
        medical_case_list: {
          all: 'Tous',
          waiting: 'Patients en attente pour',
          search: 'Rechercher',
          sort: 'Trier',
          name: 'Prénom',
          surname: 'Nom de famille',
          status: 'Statut',
          no_medical_cases: 'Aucune consultation en cours',
          not_found: "Pas d\'enregistrement trouvé",
          waiting_triage: 'Examen initial',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnostic: 'Diagnostic',
        },
        patient: {
          first_name: 'Prénom *',
          last_name: 'Nom *',
          birth_date: 'Date de naissance',
          gender: 'Genre *',
          male: 'Masculin',
          female: 'Féminin',
          age_not_defined: 'Âge non défini',
          reason: 'Motif du changement de centre de santé',
          day: 'Jour',
          month: 'Mois',
          year: 'Année *',
        },
        login: {
          title: 'Connexion',
          welcome: 'Bienvenue',
          add_account: 'Ajouter un compte',
          send_device_info: 'Envoyer infos appareil',
          clear_sessions: 'Supprimer sessions',
          error_char: 'Au moins 6 caractères',
          error_letter: 'Au moins une lettre, au moins un chiffre',
          email: 'E-mail',
          password: 'Mot de passe',
          connect: 'Se connecter',
        },
        code_session_screen: {
          title: 'Bienvenue',
          your_code: 'Votre code',
          set_code: 'Définir code',
          type_your_code: 'Re-saisir le code',
          error_char: 'Minimum 6 caractères',
          error_same: 'Le code doit être identique',
          error_letter: 'Au moins 1 lettre, au moins 1 chiffre',
        },
        basic_measurements: {
          temperature: 'Température',
          heart_rate: 'Fréquence cardiaque',
          height: 'Hauteur',
          weight: 'Poids',
          respiratory_rate: 'Fréquence respiratoire',
        },
        new_session: {
          title: 'Se connecter à medAL-creator',
          unlock_session: 'Connexion locale',
          connect: 'Connexion',
        },
        unlock_session: {
          who: 'Qui êtes-vous ?',
          fill: 'Veuillez compléter les champs invité',
          pin: 'Introduire le NIP pour déverrouiller la tablette',
          current_user: 'Connecté(e) en tant que',
          email: 'E-mail',
          assign: 'Un administrateur va associer cet appareil à votre centre de santé',
          code: 'Code',
          unlock: 'Déverrouiller',
          title: 'Synchro avec medAL-creator',
          new_session: 'Nouvelle session',
          sync_group: 'Synchroniser',
          logout: 'Déconnexion',
          role: 'Rôle',
        },
        popup: {
          startSave: 'Enregistrer consultation',
          saveSuccess: 'Enregistré',
          unlock: 'Forcer déverrouillage consultation',
          close: 'Fermer',
          desc: 'Description',
          version_name: 'version',
          version: 'Mise à jour de version',
          title: 'Veuiller autoriser la localisation GPS',
          message: 'La localisation est nécessaire au bon fonctionnement de l\'app',
          ask_me_later: 'Me demander plus tard',
          cancel: 'annuler',
          ok: 'OK',
          by: 'par',
          summary: 'Résumé',
          isLocked: 'Consultation verrouillée ',
          at: 'à',
        },
        sessions: {
          active: 'Sessions actives',
          empty: 'Aucune session',
        },
        home: {
          title: 'Accueil',
        },
        navigation: {
          medical_case_list: 'Consultations',
          home: 'Accueil',
          triage: 'Examen initial',
          patient_upsert: 'Patient(e)',
          patient_edit: 'Modif Patient(e)',
          patient_list: 'Liste patient(e)s',
          patient_search: 'Chercher patient(e)',
          patient_profile: 'Profil patient(e)',
          synchronize: 'Synchroniser',
          patient_add: 'Nouveau patient',
          patient_qr: 'Scanner QR code',
          settings: 'Réglages',
          my_profile: 'Mon profil',
          logout: 'Logout',
          synchronization: 'Synchronization',
          emergency: 'Emergency',
          diagnosticsstrategy: 'Diagnoses',
          conditions: 'Treatment Conditions',
          filter: 'Filters',
          step_invalid: 'Step not valid. Please complete all of the mandatory fields',
          about: 'About',
          consent_list: "Facility's consent files",
          qr_reader: 'Scanner',
        },
        common: {
          back: 'Back',
          disconnect: 'Disconnect',
          consultation: 'Consultation',
          patient_data: 'Patient',
          continue: 'Continue',
          page_content: 'Page content',
        },
        filters: {
          title: 'Filters',
          clear: 'Clear all',
          apply: 'Apply',
          status: 'Status',
        },
        notifications: {
          empty_code: 'Votre code est vide, veuillez le renseigner SVP',
          invalid_code: ' Votre code local est invalide, veuillez ré-essayer',
          session_does_not_exist: 'Votre utilisateur local n\'existe pas, veuillez ré-essayer SVP',
          session_already_exist: 'Une session existe déjà',
          no_internet: "Vous n'avez pas de connexion internet",
          connection_successful: 'Conncté(e)',
          algorithm_updated: 'Votre algorithme a été mis à jour',
          get_group: 'Centre de santé et personnel de santé en cours de réception',
          device_registered: 'Appareil enregistré',
        },
        synchronize: {
          title: 'Consultations à syncrhoniser',
          synchronize: 'Synchroniser',
          not_warning: 'Les consultations n\'ont pas été synchronisées depuis plus d\'une semaine',
          main_data_address_missing: 'URL du serveur medAL-data manquante dans la configuration du centre de santé',
          error: 'Erreur sur le serveur medAL-data',
        },
      }
    },
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
  });

export default i18n;
