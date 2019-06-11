import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { Text } from "native-base";

export interface I18nTypes<T> {
  t: (key: $Keys<T>, options?: Object) => string;
  translations: { [key: string]: T & $Shape<T> };
}

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    const deviceLocale = DeviceInfo.getDeviceLocale();
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
        menu: {
          triage: 'Triage',
          assessment: 'First look assessment',
          vital_signs: 'Vital signs',
          comorbidities: 'Comorbidities',
          vacciantion_history: 'Vaccination history',
          chief_complaint: 'Chief complaint categories',
          consultation: 'Consultation',
          medical_history: 'Medical history',
          physical_exam: 'Physical exam',
          poct: 'POCT',
          tests: 'Tests',
          strategy: 'Diagnoses and strategy',
          search: 'Search a patient',
          add: 'Add a patient',
        },
        settings: {
          devices: 'Medical Devices',
          tests: 'Medical Tests available',
          awake: 'keep awake',
          app: 'Application',
        },
        work_case: {
          create: 'Create a medical case',
          medical_case: 'Medical case',
          medical_cases: 'Medical cases',
          no_medical_cases: 'No medical cases',
          no_algorithms: 'No algorithms in memory',
        },
        patient_detail: {
        },
        patient_list: {
          waiting: 'Patients waiting for',
          sort: 'Sort by',
          name: 'Name',
          status: 'Status',
        },
        login: {
          server: 'server',
          local: 'local',
          your_code: 'Your code',
          welcome: 'Welcome',
          set_code: 'Set this code',
          type_your_code: 'Retype your code',
          error_char: 'Minimum 6 characters',
          error_same: 'The code must be the same',
          error_letter: 'At least one letter and one number',
          add_account: 'Add an account',
          send_device_info: 'Send device data',
          clear_sessions: 'Delete sessions',
          password: 'Password',
          login: 'Login',
        },
        unlock_session: {
          code: 'Code',
          unlock: 'Unlock session'
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
        common: {
          disconnect: 'Disconnect',
          consultation: 'Consultation',
          patient_data: 'Patient data',
          settings: 'Settings',
          patient_list: 'Patient list',
          algorithms_av: 'Available algorithms',
          currentLanguage: 'Die Sprache ist auf "{{lng}}" gesetzt',
          actions: {
            toggleToGerman: 'Deutsch',
            toggleToEnglish: 'English',
            goToPage2: 'Öffne Seite 2',
          },
        },
      },
      fr: {
        settings: {
          devices: 'Appareils médicaux',
          tests: 'Tests Médicaux disponible',
          app: 'Application',
          awake: 'Empécher la mise en veille',
        },
        work_case: {
          create: 'Créer un cas médical',
          medical_case: 'Cas médical',
          medical_cases: 'Cas médicaux',
          no_medical_cases: 'Aucun cans médicaux',
          no_algorithms: 'Aucun algorithme',
        },
        patient_detail: {
        },
        patient_list: {
          waiting: 'En attente',
          sort: 'Trier par',
          name: 'Nom',
          status: 'Status',
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
          unlock: 'Déverrouiller la session'
        },
        popup: {
          title: "Merci d'autoriser l'accès à la position",
          message:
            'Le partage de localisation est obligatoire afin de pouvoir utiliser le service médical',
          ask_me_later: 'Demandez moi plus tard',
          cancel: 'annuler',
        },
        sessions: {
          active: 'Sessions active',
          empty: 'Aucune session',
        },
        common: {
          disconnect: 'Déconnecter',
          consultation: 'Consultation',
          patient_data: 'Données patient',
          settings: 'Paramétres',
          patient_list: 'Liste des patients',
          algorithms_av: 'Algorithmes disponibles',
          currentLanguage: 'Die Sprache ist auf "{{lng}}" gesetzt',
          actions: {
            toggleToGerman: 'Deutsch',
            toggleToEnglish: 'English',
            goToPage2: 'Öffne Seite 2',
          },
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
