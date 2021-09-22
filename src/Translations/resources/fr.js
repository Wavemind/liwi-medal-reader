export default {
  actions: {
    continue: 'Continuer',
    login: 'Connexion',
    new_patient: 'Nouveau patient',
    search: 'Rechercher',
    select: 'Choisir',
    synchronize: 'Synchroniser',
    clear_filters: 'Réinitialiser',
    clear_selection: 'Réinitialiser',
    loading: 'Chargement…',
    new_medical_case: 'Nouvelle consultation',
    show_consent: 'Voir consentement',
    scan_consent: 'Scanner consentement',
    add: 'Ajouter',
    apply: 'Appliquer',
    reset: 'Réinitialiser',
    save: 'Enr.',
  },
  algorithm: {
    version_id: 'ID de version',
    version_name: 'Nom de version',
    json_version: 'N° de build de version',
    updated_at: 'Dernière màj',
  },
  application: {
    algorithm_translation_missing: "Traduction d'algorithme manquante",
    no_results: 'Aucun résultat trouvé',
    search: 'Rechercher',
    theme: {
      dark_mode: 'Mode sombre',
      light_mode: 'Mode clair',
    },
  },
  answers: {
    yes: 'Oui',
    no: 'Non',
    measured: 'Mesuré',
    estimated: 'Estimé',
  },
  containers: {
    auth: {
      login: {
        title: 'Connexion à medAL-creator',
        email: 'E-mail',
        password: 'Mot de passe',
        environment: 'Environnement',
      },
      synchronization: {
        title: 'Synchonisation avec medAL-creator',
        description:
          'Un·e administrateur·trice va associer cette tablette avec votre centre de santé',
      },
      pin: {
        unlock: "Entrer le NIP pour déverrouiller l'application",
        delete: 'Effacer',
      },
    },
    additional_list: {
      title: 'Veuillez choisir vos {{ items }}',
    },
    filters: {
      title: 'Filtres',
      patient_info: 'Infos patient·e',
      others: 'Autres',
    },
    home: {
      title: 'Dernières consultations',
    },
    medical_case: {
      no_questions: 'Aucune question à afficher',
      duration_title: 'durée en jours',
      navigation: {
        back: 'Préc.',
        next: 'Suiv.',
      },
      list: {
        title: 'Consultations',
        name: 'Nom',
        status: 'Statut',
      },
      stages: {
        registration: 'Admission',
        first_assessments: 'Evaluation initiale',
        consultation: 'Consultation',
        assessments: 'Tests',
        diagnoses: 'Diagnostics',
        closed: 'Terminé',
      },
      steps: {
        registration: 'Admission',
        unique_triage_questions: 'Urgences potentiellement mortelles',
        complaint_categories: 'Motifs de consultation',
        basic_measurements: 'Prise de mesures',
        medical_history: 'Anamnèse',
        physical_exams: 'Examen physique',
        assessments: 'Tests',
        final_diagnoses: 'Diagnostics',
        healthcare_questions: 'Questions de prise en charge',
        medicines: 'Médicaments',
        formulations: 'Formulations',
        summary: 'Récapitulatif',
        referral: 'Orientation',
      },
      registration: {
        questions: 'Questions',
      },
      common: {
        agree: 'Accepter',
        disagree: 'Rejeter',
      },
      diagnoses: {
        diagnoses: 'Diagnostics',
        proposed_title: 'Diagnostics proposés',
        additional_title: 'Diagnostics supplémentaires',
        additional_placeholder: 'Choisir {{ item }} supplémentaires',
        multiple_diagnostics: 'des diagnostics',
        multiple_drugs: 'des médicaments',
        custom_title: 'Diagnostics manuels',
        custom_placeholder: 'Ajouter des diagnostics manuellement',
        no_proposed: 'Aucun diagnostic proposé',
        no_additional: 'Aucun diagnostic supplémentaire sélectionné',
        no_custom: 'Aucun diagnostic ajouté manuellement',
      },
      /* al 20210912 removed from diagnoses: proposed_title: 'Diagnostics proposés par {{ version_name }}', */
      drugs: {
        drugs: 'Médicaments',
        proposed: 'Proposés',
        additional: 'Supplémentaires',
        custom: 'Ajoutés manuellement',
        custom_placeholder: 'Ajouter des médicaments manuellement',
        no_proposed: 'Aucun médicament proposé',
        no_additional: 'Aucun médicament supplémentaire sélectionné',
        no_custom: 'Aucun médicament ajouté manuellement',
        no_medicines: 'Aucun médicament disponible',
      },
      formulations: {
        title:
          'Choisir une formulation disponible et appropriée pour votre patient·e',
      },
      summary: {
        date_consultation: 'Date de la consultation',
        age_date_consultation: 'Age lors de la consultation',
        management_consulting: 'Prise en charge et conseils',
        no_managements: 'Aucune prise en charge disponible',
      },
    },
    scan: {
      scan: 'Scanner le code QR',
      new: 'Vous devez fournir une nouvelle étiquette',
      new_sticker_notification:
        'Vous devez donner une nouvelle étiquette à votre patient·e',
      new_sticker_wrong_facility:
        "La nouvelle étiquette n'appartient pas à votre centre de santé",
      wrong_format: "Le code QR n'est pas au bon format",
    },
    patient: {
      list: {
        title: 'Liste de patient·e·s',
        name: 'Nom',
        last_visit: 'Dernière visite',
        status: 'Statut',
        no_active_consultations: 'Aucune consultation chargée',
      },
      consultations: {
        current_consultation: 'Consultation actuelle',
        last_consultations: 'Dernières consultations',
      },
      personal_info: {
        patient_info: 'Patient·e',
        consultations_info: 'Consultations',
      },
    },
    consent: {
      list: {
        title: 'Dossiers de consentement',
      },
    },
    synchronization: {
      synchronize: 'Synchroniser',
      not_synchronized: 'Consultations en attente de synchronisation',
      warning:
        "Vous n'avez pas syncrhonisé les consultations avec le serveur medAL-data depuis plus de 7 jours",
    },
    settings: {
      general: {
        title: 'Général',
        environment: 'Environnement',
        app_languages: "Langue de l'application",
        algorithm_languages: "Langue de l'algorithme",
        app_version: "Version de l'application",
        languages: {
          en: 'English',
          fr: 'Français',
        },
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
    consent: {
      title: 'Consentement',
      question:
        'Consentez-vous au traitement des données pour cette visite ? (Non si refus)',
    },
    date: {
      days: 'Jour',
      months: 'Mois',
      years: 'Année',
      estimated: {
        days: 'En jours',
        months: 'En mois',
        years: 'En années',
      },
    },
    summary: {
      no_questions: "Aucune question n'a été posée à cette étape",
      no_comments: 'Aucun commentaire',
    },
    medical_case_drawer: {
      current_medical_case: 'Consultation en cours',
    },
    modals: {
      lock: {
        title: 'Consultation verrouillée',
        content: 'Consultation verrouillée par {{ name }}',
        unlock_button: 'FORCER DÉVERROUILLAGE',
        summary_button: 'RÉCAPITULATIF',
      },
      emergency: {
        title: "Assistance d'urgence",
        content:
          "Le patient présente un symptôme ou un signe d'urgence. Voir la page d'urgence maintenant si nécessaire.",
        emergencyButton: "VOIR LA PAGE D'URGENCES",
      },
      exit_medical_case: {
        title: 'Quitter la consultation',
        content: 'Vous êtes sur le point de quitter la consultation',
        exit_and_save: 'Enregistrer',
        exit_without_save: 'Ne pas enregistrer',
      },
      exit_app: {
        title: "Quitter l'application",
        content: "Voulez-vraiment quitter l'application ?",
        ok: 'OK',
        back: 'Annuler',
      },
    },
    media: {
      file_not_supported: 'Format de fichier non pris en charge',
    },
    study: {
      no_content: 'No content',
    },
  },
  device: {
    name: 'Nom',
    mac_address: 'Adresse MAC',
    model: 'Modèle',
    brand: 'Marque',
    os: "Système d'exploitation (OS)",
    os_version: "Version d'OS",
    name_not_available: 'Pas de nom disponible',
  },
  database: {
    success: {
      message: 'Enregistrer',
      description: 'Consultation enregistrée avec succès',
    },
    error: {
      message: 'Erreur',
      description:
        'Une problème est survenu à la sauvegarde de la consultation',
    },
    createMedicalCaseError: {
      message: 'Erreur',
      description: 'Un problème est survenu à la création de la consultation',
    },
    patientLoadError: {
      message: 'Erreur',
      description: 'Un problème est survenu pendant le chargement patient·e',
    },
  },
  errors: {
    offline: {
      title: 'Erreur de communication avec medAL-data',
      description: 'Serveur introuvable',
    },
  },
  health_facility: {
    id: 'ID',
    name: 'Nom',
    architecture: 'Architecture',
    country: 'Pays',
    area: 'Région/Zone',
    local_data_ip: 'Adresse medAL-hub',
    main_data_ip: 'Adresse medAL-data',
    custom_clinician: 'Collabora·teur·trice manquant·e',
    custom_clinician_subtitle: 'Ajouter utilisa·teur ·trice temporaire',
    roles: {
      title: 'Fonctions',
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
    scan_qr_code: 'Scanner code QR',
    consultations: 'Consultations',
    patient_list: 'Liste patient·e·s',
    personal_info: 'Infos personnelles',
    summary: 'Récapitulatif',
    final_diagnoses: 'Diagnostics',
    questions: 'Questions',
    consent_list: 'Consentements',
    current_consultation: 'Consultation en cours',
    home: 'Accueil',
    medical_case:
      '{{first_name}} {{last_name}} - {{birth_date }} ({{ readable_date }})',
    synchronization: 'Synchronisation',
    welcome: 'Bienvenue {{ clinician }}',
    settings: 'Réglages',
    about: 'À propos',
    synchronize: 'Synchroniser',
    logout: 'Se déconnecter',
  },
  patient: {
    first_name: 'Prénom',
    last_name: 'Nom',
    gender: 'Sexe',
    birth_date: 'Date de naissance',
    estimated_age: 'Âge estimé',
    reason: 'Raison du changement de centre de santé',
    readable_birth_date: {
      days: '{{value}} jours',
      weeks: '{{value}} semaines',
      months: '{{value}} mois',
      years: '{{value}} ans',
    },
  },
  medical_case: {
    comment: 'Commentaire',
  },
  permissions: {
    message:
      "Vous devez accorder les permissions nécessaires au bon fonctionnement de l'application.",
    instructions:
      'Veuillez vous rendre dans la section "Permissions" des réglages de votre tablette pour accorder toutes les permissions nécessaires',
  },
  formulations: {
    drug: {
      give: 'Donner',
      mg: 'mg',
      caps: 'capsule(s) de',
      every: 'chaque',
      h: 'heure(s) pendant',
      days: 'jour(s)',
      mode: 'Mode',
      tablet: 'comprimé(s) de',
      d: 'durée',
      during: 'pendant',
      admin: 'Administration',
      ml: 'ml',
      of: 'de',
      tablets: 'comprimé(s)',
      capsules: 'capsule(s)',
      inhaler: 'inhalation(s)',
      patch: 'patch(es)',
      spray: 'spray(s)',
      pessary: 'pessaire(s)',
      no_formulation: ' Aucune formulation sélectionnée',
      missing_medicine_formulation: 'Veuillez sélectionner une formulation',
      no_options: 'Aucune option compatible',
      medication_form_not_handled: 'Forme galénique non prise en charge',
    },
    medication_form: {
      tablet: 'Comprimé',
      dispersible_tablet: 'Comprimé non-dispersible',
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
  },
  validation: {
    is_required: 'La question « {{ field }} » est obligatoire',
    consent_file_blank:
      'La réponse au consentement du traitement des données est obligatoire',
    final_diagnoses_required:
      'Veuillez accepter ou refuser chacun des diagnostics proposés',
    medicines_required:
      'Veuillez accepter ou refuser chacun des médicaments proposés',
    formulation_required: 'Please choose a formulation for each medicine',
  },
}
