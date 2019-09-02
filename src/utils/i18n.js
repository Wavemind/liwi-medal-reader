import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    const deviceLocale = DeviceInfo.getDeviceLocale();
    callback(deviceLocale);
  },
  init: () => {
  },
  cacheUserLanguage: () => {
  },
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        summary: {
          title: 'Current Summary',
          diagnoses: 'Diagnoses',
        },
        assessment: {
          title: 'First look assessment',
        },
        consultation: {
          medical_history: 'Medical History',
          physical_exam: 'Physical Exam',
          poct: 'Poct',
        },
        triage: {
          first_look_assessment: 'First look Assessments',
          vital: 'Vital Signs',
          chronical_condition: 'Chronical conditions',
          other: 'Others',
          chief: 'Chief complaints',
        },
        form: {
          required: ' is required',
          save: 'Save',
          edit: 'Edit',
          back: 'Back',
          next: 'Next',
          next_stage: 'Next stage'
        },
        question: {
          yes: 'Yes',
          no: 'No',
        },
        menu: {
          triage: 'Triage',
          first_look_assessments: 'First look assessment',
          vital_signs: 'Vital signs',
          chronical_conditions: 'Chronical conditions',
          chief_complaints: 'Chief complaint categories',
          consultation: 'Consultation',
          medical_history: 'Medical history',
          physical_exam: 'Physical exam',
          poct: 'POCT',
          tests: 'Tests',
          strategy: 'Diagnoses and strategy',
          search: 'Search a patient',
          add: 'Add a patient',
          others: 'Others',
        },
        medical_case: {
          waiting_triage: 'Waiting for triage',
          triage: 'Triage',
          waiting_consultation: 'Waiting for consultation',
          consultation: 'Consultation',
          waiting_test: 'Waiting for test',
          test: 'Test',
          waiting_final_diagnostic: 'Wait for diagnosis',
          final_diagnostic: 'Diagnosis',
          close: 'Close',
        },
        settings: {
          devices: 'Medical Devices',
          tests: 'Medical Tests available',
          awake: 'keep awake',
          app: 'Application',
        },
        work_case: {
          create: 'New case',
          medical_case: 'Medical case',
          medical_cases: 'Medical cases',
          no_medical_cases: 'No medical cases',
          no_algorithms: 'No algorithms in memory',
          no_questions: 'There are no questions for this category'
        },
        patient_detail: {},
        patient_upsert: {
          title: 'Patient',
          save_and_wait: 'Save + add to waiting list',
          save_and_case: 'Save + create new case',
          save: 'Save',
        },
        patient_list: {
          all: 'All',
          waiting: 'Patients waiting for',
          search: 'Search',
          sort: 'Sort by',
          name: 'Name',
          status: 'Status',
          no_patients: 'There are no patients',
          not_found: 'No match found',
          waiting_triage: 'Triage',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnostics: 'Diagnosis',
          case_in_progress: 'a case is open',
        },
        medical_case_list: {
          all: 'All',
          waiting: 'Patients waiting for',
          search: 'Search',
          sort: 'Sort by',
          name: 'Name',
          status: 'Status',
          no_medical_cases: 'There are no medical cases in progress',
          not_found: 'No match found',
          waiting_triage: 'Triage',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnosis: 'Diagnosis',
        },
        patient: {
          first_name: 'First name',
          last_name: 'Last name',
          birth_date: 'Day of birth',
          gender: 'Gender',
          male: 'Male',
          female: 'Female',
        },
        login: {
          title: 'Login',
          welcome: 'Welcome',
          add_account: 'Add an account',
          send_device_info: 'Send device data',
          clear_sessions: 'Delete sessions',
          email: 'Email',
          password: 'Password',
          connect: 'Login',
        },
        code_session_screen: {
          title: 'Welcome',
          your_code: 'Your code',
          set_code: 'Set this code',
          type_your_code: 'Retype your code',
          error_char: 'Minimum 6 characters',
          error_same: 'The code must be the same',
          error_letter: 'At least one letter and one number',
        },
        vital_signs: {
          temperature: 'Temperature',
          heart_rate: 'Heart rate',
          height: 'Height',
          weight: 'Weight',
          respiratory_rate: 'Respiratory rate',
        },
        new_session: {
          title: 'Connect to main server',
          unlock_session: 'Local login',
        },
        unlock_session: {
          email: 'Email',
          code: 'Code',
          unlock: 'Login',
          title: 'Local login',
          new_session: 'Create new session',
        },
        popup: {
          title: 'Please allow access to the position',
          message:
            'Location sharing is mandatory in order to use the medical service',
          ask_me_later: 'Ask me later',
          cancel: 'cancel',
        },
        sessions: {
          active: 'Sessions active',
          empty: 'No session',
        },
        home: {
          title: 'Home',
        },
        navigation: {
          medical_case_list: 'Case in progress',
          home: 'Home',
          patient_upsert: 'Patient',
          patient_list: 'Patient list',
          patient_search: 'Search a patient',
          patient_profile: 'Patient profile',
          case_in_progress: 'Case in progress',
          synchronize: 'Synchronize',
          patient_add: 'New patient',
          settings: 'Settings',
          my_profile: 'My profile',
          logout: 'Logout',
          available_algorithms: 'Available algorithms',
        },
        common: {
          back: 'Back',
          disconnect: 'Disconnect',
          consultation: 'Consultation',
          patient_data: 'Patient data',
        },
        notifications: {
          empty_code: 'Your code is empty, please write it',
          invalid_code: ' Your local code is invalid, please try again',
          session_does_not_exist: 'Your local user does not exist, please try again',
          session_already_exist: 'Session already exist',
          no_internet: 'You don\'t have internet connection',
          algorithm_updated: 'Your algorithm has been updated'
        },
      },
      fr: {
        summary: {
          title: 'Résumé actuel',
          diagnoses: 'Diagnostic',
        },
        notifications: {
          empty_code: 'Votre code est vide, veuillez l\'écrire',
          invalid_code: 'Votre code local n\'est pas valide, veuillez réessayer.',
          session_does_not_exist: 'Cet utilisateur local n\'existe pas, veuillez réessayer.',
          session_already_exist: 'La session existe déjà',
          no_internet: 'Vous n\'avez pas de connexion internet',
        },
        consultation: {
          medical_history: 'Medical History',
          physical_exam: 'Physical Exam',
          poct: 'Poct',
        },
        triage: {
          assessment: 'First look Assessments',
          vital: 'Vital Signs',
          comorbidities: 'Comorbidities',
          vaccination: 'Vaccination history',
          chief: 'Chief complaints',
        },
        settings: {
          devices: 'Appareils médicaux',
          tests: 'Tests Médicaux disponible',
          app: 'Application',
          awake: 'Empécher la mise en veille',
        },
        work_case: {
          create: 'Nouveau cas médical',
          medical_case: 'Cas médical',
          medical_cases: 'Cas médicaux',
          no_medical_cases: 'Aucun cans médicaux',
          no_algorithms: 'Aucun algorithme',
        },
        patient_detail: {},
        patient_list: {
          waiting: 'En attente',
          search: 'Rechercher',
          sort: 'Trier par',
          name: 'Nom',
          status: 'Status',
          no_patients: 'Aucun patients',
          not_found: 'Aucun résultat',
        },
        login: {
          server: 'server',
          local: 'local',
          your_code: 'Votre code',
          welcome: 'Bienvenue',
          set_code: 'Définir ce code',
          type_your_code: 'Retaper votre code',
          error_char: 'Minimum 6 caractères',
          error_same: 'Le code doit être le même',
          error_letter: 'Au moins une lettre et un chiffre',
          add_account: 'Ajouter un compte',
          send_device_info: 'Envoyer les infos du mobile',
          clear_sessions: 'Vider les sessions',
          password: 'Mot de passe',
          login: 'Connecter',
        },
        unlock_session: {
          code: 'Code',
          unlock: 'Déverrouiller la session',
        },
        popup: {
          title: 'Merci d\'autoriser l\'accès à la position',
          message:
            'Le partage de localisation est obligatoire afin de pouvoir utiliser le service médical',
          ask_me_later: 'Demandez moi plus tard',
          cancel: 'annuler',
        },
        sessions: {
          active: 'Sessions active',
          empty: 'Aucune session',
        },
        navigation: {
          patient_update: 'Patient Update',
          patient_list: 'Liste des patients',
          settings: 'Paramètres',
          available_algorithms: 'Algorithmes disponibles',
        },
        common: {
          back: 'Retour',
          disconnect: 'Déconnecter',
          consultation: 'Consultation',
          patient_data: 'Données patient',
        },
      },
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
