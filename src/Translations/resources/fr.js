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
        title: 'Connexion à medAL-data',
        server_address: 'Adresse du serveur',
        client_id: "ID de l'appareil",
      },
      synchronize: {
        title: 'Synchonisation avec medAL-data',
      },
      pin: {
        unlock: "Entrer le NIP pour déverrouiller l'application",
        delete: 'Effacer',
        retrieving_algorithm: 'Recherche de nouvel algorithme...',
        new_algorithm: 'Nouvel algorithme chargé',
        no_change_algorithm:
          "Pas de changement. Chargement de l'algorithme local",
        retrieving_emergency_content:
          "Recherche de mise à jour du contenu d'urgence...",
        new_emergency_content: "Contenu d'urgence chargé",
        no_change_emergency_content:
          'Pas de changement. Chargement du contenu local',
      },
    },
    additional_list: {
      title: 'Veuillez choisir vos diagnostics',
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
        additional_placeholder: 'Choisir diagnostics supplémentaires',
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
        proposed: 'Médicaments proposés',
        additional: 'Médicaments supplémentaires',
        select_additional:
          'Sélectionnez les médicaments supplémentaires de la liste',
        custom: 'Ajoutés manuellement',
        custom_placeholder: 'Ajouter des médicaments manuellement',
        related_placeholder: 'Sélectionnez les diagnostiques',
        select_related: 'Sélectionnez les diagnostiques pour continuer',
        no_proposed: 'Aucun médicament proposé',
        no_additional: 'Aucun médicament supplémentaire sélectionné',
        no_custom: 'Aucun médicament ajouté manuellement',
        no_medicines: 'Aucun médicament disponible',
        indication: 'Indication',
        duration_invalid: "Ne peut pas être déterminée par l'algorithme (NaN)",
      },
      formulations: {
        title:
          'Choisir une formulation disponible et appropriée pour votre patient·e',
      },
      summary: {
        final_diagnoses: 'Diagnostics',
        treatments: 'Traitements',
        managements: 'Prise en charges',
        date_consultation: 'Date de la consultation',
        age_date_consultation: 'Age lors de la consultation',
        management_consulting: 'Prise en charge et conseils',
        no_managements: 'Aucune prise en charge disponible',
      },
      summary_wrapper: {
        patient_uuid: 'UUID patient',
        consultation_id: 'ID consultation',
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
        consultations_info: 'Détails admission',
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
      title: 'Sélectionnez la date',
      confirm: 'Confirmer',
      cancel: 'Annuler',
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
      study: {
        no_content: 'Aucun contenu',
      },
    },
    media: {
      file_not_supported: 'Format de fichier non pris en charge',
    },
  },
  device: {
    name: 'Nom',
    device_id: 'ID',
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
      title: 'Erreur de communication avec {{ serverName }}',
      description: 'Serveur introuvable',
    },
    token: {
      title: "Erreur d'authentification",
      description: 'Token invalid',
    },
    unknown: {
      title: 'Erreur de communication',
      description: 'Un problème inconnu est survenu',
    },
    zip: {
      archived: 'Un problème est survenu lors de la compression du fichier',
    },
    timeout: 'Connexion au serveur interrompue',
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
    synchronization: 'Synchronisation',
    welcome: 'Bienvenue',
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
      missing_medicine_formulation: 'Veuillez choisir une formulation',
      no_options: 'Aucune option compatible',
      medication_form_not_handled: 'Forme galénique non prise en charge',
      indication: 'Indication',
      indication_plural: 'Indications',
      dose_calculation: 'Calcul du dosage',
      formulation: 'Formulation',
      route: "Voie d'administration",
      amount_to_be_given: 'Quantité à administrer',
      preparation_instruction: 'Instructions de préparation',
      frequency: 'Fréquence',
      duration: 'Durée',
      administration_instruction: "Instructions d'administration",
      pre_referral_duration: 'Pour la durée du transfert',
      per_administration: '{{ count }} {{ suffix }} par administration',
      per_application: '{{ count }} application par administration',
      per_application_plural: '{{count}} applications par administration',
      duration_in_days: '{{ count }} jour',
      duration_in_days_plural: '{{ count }} jours',
      fixed_dose: 'Dose fixe',
      amount_give: 'Donner {{- medicationForm }}',
      amount_given_per_application:
        '{{ count }} application par administration',
      amount_given_per_application_plural:
        '{{ count }} applications par administration',
      amount_given_medication_form:
        'Donner {{- medicationForm }} par administration',
      amount_given_im_iv_sc:
        'Donner {{ doseResult }}ml à {{ liquidConcentration }}mg/{{ doseForm }}ml {{ medicationForm}}',
      frequency_indication:
        '{{ count }} fois par jour (toutes les {{ recurrence }} heures)',
      fixed_dose_indication_administration:
        'Dose fixe - {{ medicationForm }} par administration',
      fixe_dose_indication_application:
        'Dose fixe - {{ count }} application par administration',
      fixe_dose_indication_application_plural:
        'Dose fixe - {{ count }} applications par administration',
      dose_indication:
        'Dose adaptée ({{ dosage }}mg/kg) x poids ({{ patientWeight }}kg) = {{ total }}mg',
    },
    administration_routes: {
      orally: 'Orale',
      sublingually: 'Sublinguale',
      rectally: 'Rectale',
      iv: 'Intraveineuse (IV)',
      im: 'Intramusculaire (IM)',
      sc: 'Sous-cutanée (SC)',
      otic: 'Auriculaire',
      nasally: 'Nasale',
      inhalation: 'Inhalation',
      cutaneous: 'Cutanée',
      transdermally: 'Transdermique',
      ocular: 'Ophtalmique',
    },
    medication_form: {
      tablet: '{{- fraction }} comprimé',
      tablet_0: '{{- fraction }} comprimé',
      tablet_plural: '{{- fraction }} comprimés',
      dispersible_tablet: '{{- fraction }} comprimé dispersible',
      dispersible_tablet_0: '{{- fraction }} comprimé dispersible',
      dispersible_tablet_plural: '{{- fraction }} comprimés dispersibles',
      capsule: '{{ count }} capsule',
      capsule_0: '{{ count }} capsule',
      capsule_plural: '{{ count }} capsules',
      syrup: 'syrop',
      suspension: '{{ count }} de suspension',
      suppository: '{{ count }} suppositoire',
      suppository_plural: '{{ count }} suppositoires',
      drops: '{{ count }} goutte',
      drops_plural: '{{ count }} gouttes',
      solution: '{{ count }} de solution',
      powder_for_injection: '{{ count }} de poudre pour injection',
      patch: '{{ count }} patch',
      patch_plural: '{{ count }} patchs',
      cream: '{{ count }} de crème',
      lotion: '{{ count }} de lotion',
      pessary: '{{ count }} pessaire',
      pessary_plural: '{{ count }} pessaires',
      ointment: "{{ count }} d'onguent",
      gel: '{{ count }} de gel',
      spray: '{{ count }} de spray',
      inhaler: '{{ count }} inhalation',
      inhaler_plural: '{{ count }} inhalations',
    },
  },
  reference_table: {
    above: '{{number}} ou supérieur',
    lower: '{{number}} ou inférieur',
    between: 'Entre {{number_1}} et {{number_2}}',
  },
  validation: {
    is_required: 'La question « {{ field }} » est obligatoire',
    consent_file_blank:
      'La réponse au consentement du traitement des données est obligatoire',
    final_diagnoses_required:
      'Veuillez accepter ou refuser chacun des diagnostics proposés',
    medicines_required:
      'Veuillez accepter ou refuser chacun des médicaments proposés',
    formulation_required:
      'Veuillez sélectionner une formulation pour chaque médicament',
    duration_required: 'Veuillez fournir une durée pour chaque médicament',
  },
}
