export default {
  actions: {
    select: 'Choisir',
    continue: 'Continue',
    login: 'Se connecter',
    synchronize: 'Synchroniser',
  },
  algorithm: {
    version_id: 'ID de la version',
    version_name: 'Nom de la version',
    json_version: 'Numéro de version',
    updated_at: 'Date de dernière modification',
  },
  application: {
    theme: {
      dark_mode: 'Thème sombre',
      light_mode: 'Thème clair',
    },
  },
  containers: {
    auth: {
      login: {
        title: 'Connexion à medAL-creator',
        email: 'E-mail',
        password: 'Mot de passe',
        environment: 'Environment',
      },
      synchronization: {
        title: 'Synchronisation avec medAL-creator',
        description:
          'Un administrateur va associer cet appareil à votre centre de santé',
      },
      pin: {
        unlock: 'Introduire le NIP pour déverrouiller la tablette',
      },
    },
    settings: {
      general: {
        title: 'Général',
        environment: 'Environment',
        app_languages: "Langue de l'application ",
        algorithm_languages: "Langue de l'algorithm",
      },
      algorithm: {
        title: 'Algorithme',
      },
      health_facility: {
        title: 'Centre de santé',
      },
      device: {
        title: 'Appareil',
      },
    },
  },
  components: {
    modal: {
      study: {
        no_content:
          "Aucun contenu n'est disponible. Veuillez remplir la description de l'étude dans medAL-creator",
      },
    },
  },
  device: {
    name: 'Nom',
    mac_address: 'Adresse MAC',
    model: 'Model',
    brand: 'Marque',
    os: 'OS',
    os_version: "Version de l'OS Version",
    name_not_available: 'nom undisponible',
  },
  health_facility: {
    id: 'ID',
    name: 'Nom',
    architecture: 'Architecture',
    country: 'Pays',
    area: 'Zone',
    local_data_ip: 'MedAL-hub adresse',
    main_data_ip: 'MedAL-data adresse',
    roles: {
      medical_doctor: 'Médecin',
      assistant_medical_officer: 'Adjoint·e médical·e',
      clinical_officer: 'Praticien·ne clinique',
      nurse: 'Infirmier·ère',
      midwife: 'Sage-femme',
      pharmacist: 'Pharmacien·ne',
      registration_assistant: "Chargé·e d'enregistrement",
    },
  },
  navigation: {
    home: 'Accueil',
    settings: 'Paramètre',
  },
  permissions: {
    message:
      "Vous devez accorder les autorisations nécessaires pour que l'application fonctionne",
    instructions:
      'Veuillez vous rendre dans la section "Permissions" des paramètres de la tablette et accorder toutes les autorisations requises.',
  },
}
