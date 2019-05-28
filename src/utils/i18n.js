import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

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
        settings: {
          devices: 'Medical Devices',
          tests: 'Medical Tests available',
          awake: 'keep awake',
          app: 'Application',
        },
        workcase: {
          button_create: 'Create a medical case',
          case_medical: 'Medical cases',
          none: 'No algorithms in memory',
        },
        login: {
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
        popup: {
          title: 'Please allow access to the position',
          message:
            'Location sharing is mandatory in order to use the medical service',
          askmelater: 'Ask me later',
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
          title_home: 'Your personal space',
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
        workcase: {
          button_create: 'Créer un cas médical',
          case_medical: 'Cas médicals',
          none: 'Aucun algorithm en mémoire',
        },
        login: {
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
        popup: {
          title: "Merci d'autoriser l'accès à la position",
          message:
            'Le partage de localisation est obligatoire afin de pouvoir utiliser le service médical',
          askmelater: 'Demandez moi plus tard',
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
          title_home: 'Votre espace personnel',
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
