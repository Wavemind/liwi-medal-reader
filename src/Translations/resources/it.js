export default {
  actions: {
    continue: 'Continua',
    login: 'Login',
    new_patient: 'Nuovo paziente',
    search: 'Cerca',
    select: 'Seleziona',
    synchronize: 'Sincronizza',
    clear_filters: 'Cancella tutti i filtri',
    clear_selection: 'Cancella selezione',
    loading: 'Caricamento in corso...',
    new_medical_case: 'Nuovo caso',
    show_consent: 'Mostra consenso',
    scan_consent: 'Scansiona nuovo consenso',
    add: 'Aggiungi',
    apply: 'Applica selezione',
    reset: 'Ripristina',
    save: 'Salva',
  },
  algorithm: {
    version_id: 'Id versione',
    version_name: 'Nome versione',
    json_version: 'Build versione',
    updated_at: 'Ultimo aggiornamento',
  },
  application: {
    algorithm_translation_missing: "Manca la traduzione dell'algoritmo",
    no_results: 'Nessun risultato trovato',
    search: 'Cerca',
    theme: {
      dark_mode: 'Dark mode',
      light_mode: 'Light mode',
    },
  },
  answers: {
    yes: 'Si',
    no: 'No',
    measured: 'Misurato',
    estimated: 'Stimato',
  },
  containers: {
    auth: {
      login: {
        title: 'Connetti a medAL-data',
        server_address: 'Indirizzo server',
        client_id: 'ID dispositivo',
      },
      synchronize: {
        title: 'Sincronizza con medAL-data',
      },
      pin: {
        unlock: 'Inserisci il PIN per sbloccare il tablet',
        delete: 'Elimina',
        retrieving_algorithm: "Recupero dell'algoritmo...",
        new_algorithm: 'Nuovo algoritmo caricato',
        no_change_algorithm:
          "Nessun cambiamento. Mantenendo l'algoritmo locale",
        retrieving_emergency_content:
          'Recupero di contenuti di emergenza in corso...',
        new_emergency_content: 'Nuovo contenuto di emergenza caricato',
        no_change_emergency_content:
          'Nessun cambiamento. Mantenere i contenuti di emergenza locali',
      },
    },
    additional_list: {
      title: 'Seleziona il tuo {{ items }}',
    },
    filters: {
      title: 'Filtri',
      patient_info: 'Informazioni paziente',
      others: 'Altri',
    },
    home: {
      title: 'Ultime consultazioni',
    },
    medical_case: {
      no_questions: 'Nessuna domanda proposta',
      duration_title: 'durata in giorni',
      navigation: {
        back: 'Precedente',
        next: 'Successivo',
      },
      list: {
        title: 'Consultazioni',
        name: 'Nome',
        status: 'Stato',
      },
      stages: {
        registration: 'Registrazione',
        first_assessments: 'Valutazione iniziale',
        consultation: 'Consultazione',
        assessments: 'Tests',
        diagnoses: 'Diagnosi',
        closed: 'Chiuso',
      },
      steps: {
        registration: 'Registrazione',
        unique_triage_questions: 'Potenziali emergenze',
        complaint_categories: 'Categorie di reclamo',
        basic_measurements: 'Misure di base',
        medical_history: 'Anamnesi',
        physical_exams: 'Esami fisici',
        assessments: 'Tests',
        final_diagnoses: 'Diagnosi finali',
        healthcare_questions: 'Domande sul trattamento',
        medicines: 'Medicinali',
        formulations: 'Formulazioni',
        summary: 'Riepilogo',
        referral: 'Riferimento',
      },
      registration: {
        questions: 'Domande',
      },
      common: {
        agree: "D'accordo",
        disagree: 'Disaccordo',
      },
      diagnoses: {
        diagnoses: 'Diagnosi',
        proposed_title: 'Diagnosi proposte',
        additional_title: 'Ulteriori diagnosi selezionate',
        additional_placeholder: 'Seleziona aggiuntivo {{ item }}',
        multiple_diagnostics: 'diagnostica',
        multiple_drugs: 'medicinali',
        custom_title: 'Diagnosi aggiunte manualmente',
        custom_placeholder: 'Aggiungi le diagnosi manualmente',
        no_proposed: 'Nessuna diagnosi proposta',
        no_additional: 'Nessuna diagnosi aggiuntiva selezionata',
        no_custom: 'Nessuna diagnosi aggiunta manualmente',
      },
      /* al 20210912 removed from diagnoses: proposed_title: 'Diagnosi proposte da {{ version_name }}', */
      drugs: {
        drugs: 'Farmaci',
        proposed: 'Proposto',
        additional: 'Aggiuntivo',
        custom: 'Aggiunto manualmente',
        custom_placeholder: 'Aggiungi i tuoi farmaci',
        no_proposed: 'Nessun farmaco proposto',
        no_additional: 'Nessun farmaco aggiuntivo selezionato',
        no_custom: 'Nessun farmaco aggiunto manualmente',
        no_medicines: 'Nessun medicinale disponibile',
      },
      formulations: {
        title:
          'Quale formulazione farmacologica è disponibile e adatta al tuo paziente?',
      },
      summary: {
        date_consultation: 'Data della consultazione',
        age_date_consultation: 'Età al momento della consultazione',
        type_of_consultation: 'Tipo di consultazione',
        management_consulting: 'Management e consulenza',
        no_managements: 'Nessuna gestione disponibile',
      },
      summary_wrapper: {
        patient_uuid: 'UUID paziente',
        consultation_id: 'ID consultazione',
      },
    },
    scan: {
      scan: 'Scansiona il codice QR',
      new: 'Devi generare un nuovo sticker',
      new_sticker_notification: 'Devi dare un altro sticker al paziente',
      new_sticker_wrong_facility:
        'Il nuovo sticker non appartiene alla tua struttura',
      wrong_format: 'Il codice QR non ha il formato corretto',
    },
    patient: {
      list: {
        title: 'Elenco pazienti',
        name: 'Nome',
        last_visit: 'Ultima visita',
        status: 'Stato',
        no_active_consultations: 'Nessuna consultazione attiva',
      },
      consultations: {
        current_consultation: 'Consultazione in corso',
        last_consultations: 'Ultime consultazioni',
      },
      personal_info: {
        patient_info: 'Informazioni paziente',
        consultations_info: 'Dati di registrazione',
      },
    },
    consent: {
      list: {
        title: 'File di consenso',
      },
    },
    synchronization: {
      not_synchronized: 'Casi medici non ancora sincronizzati',
      synchronize: 'Sincronizza',
      warning: 'Non esegui la sincronizzazione da più di 7 giorni',
    },
    settings: {
      general: {
        title: 'Generale',
        environment: 'Environment',
        app_languages: "Lingua dell'app",
        algorithm_languages: 'Linguaggio algoritmo',
        app_version: 'Versione app',
        languages: {
          en: 'Inglese',
          fr: 'Francese',
          it: 'Italiano',
        },
      },
      algorithm: {
        title: 'Algoritmo',
      },
      health_facility: {
        title: 'Struttura sanitaria',
      },
      device: {
        title: 'Dispositivo',
      },
    },
  },
  components: {
    consent: {
      title: 'Consenso',
      question:
        'Consenso al trattamento dei dati per questa visita (No se revocato)',
    },
    date: {
      days: 'Giorno',
      months: 'Mese',
      years: 'Anno',
      estimated: {
        days: 'In giorni',
        months: 'In mesi',
        years: 'In anni',
      },
      title: 'Seleziona la data',
      confirm: 'Conferma',
      cancel: 'Annulla',
    },
    medical_case_drawer: {
      current_medical_case: 'Consultazione in corso',
    },
    summary: {
      no_questions: 'Nessuna domanda posta in questo passaggio',
      no_comments: 'Non ci sono commenti ',
    },
    modals: {
      lock: {
        title: 'Consultazione non disponibile',
        content: 'Il caso è bloccato da {{ name }}',
        unlock_button: 'SBLOCCO FORZATO',
        summary_button: 'SOMMARIO',
      },
      emergency: {
        title: 'Assistenza di emergenza',
        content:
          'Il paziente presenta un sintomo o un segno grave/di emergenza. Fare clic sul pulsante di emergenza se il bambino ha bisogno di cure di emergenza ora.',
        emergencyButton: "VAI ALL'EMERGENZA",
      },
      exit_medical_case: {
        title: 'Lascia la consultazione',
        content: 'Stai uscendo dalla consulenza',
        exit_and_save: 'Esci e salva',
        exit_without_save: 'Esci, non salvare',
      },
      exit_app: {
        title: "Esci dall'app",
        content: "Vuoi davvero uscire dall'app ? ",
        ok: 'OK',
        back: 'Annulla',
      },
      study: {
        no_content: 'Nessun contenuto',
      },
    },
    media: {
      file_not_supported: 'File non supportato',
    },
  },
  device: {
    name: 'Nome',
    device_id: 'ID',
  },
  database: {
    success: {
      message: 'Salva',
      description: 'Consultazione salvata con successo',
    },
    error: {
      message: 'Errore',
      description:
        'Si è verificato un errore durante il salvataggio della consultazione',
    },
    createMedicalCaseError: {
      message: 'Errore',
      description:
        'Si è verificato un errore durante la creazione della consultazione',
    },
    patientLoadError: {
      message: 'Errore',
      description:
        'Si è verificato un errore durante il caricamento del paziente',
    },
  },
  errors: {
    offline: {
      title: 'Errore di comunicazione con{{ serverName }}',
      description: 'Server non accessibile',
    },
    unknown: {
      title: 'Errore di comunicazione',
      description: 'Si è verificato un errore sconosciuto',
    },
    timeout: 'Connessione al server interrotta',
  },
  health_facility: {
    id: 'ID',
    name: 'Nome',
    architecture: 'Architettura',
    country: 'Paese',
    area: 'Area',
    local_data_ip: 'indirizzo medAL-hub',
    main_data_ip: 'indirizzo medAL-data',
    custom_clinician: 'Membro dello staff scomparso',
    custom_clinician_subtitle: 'Aggiungi utente temporaneo',
    roles: {
      title: 'Ruoli',
      medical_doctor: 'Medico (MD)',
      assistant_medical_officer: 'Assistente medico ufficiale (AMO)',
      clinical_officer: 'Funzionario clinico (CO)',
      nurse: 'Infermiera',
      midwife: 'Ostetrica',
      pharmacist: 'Farmacista',
      registration_assistant: 'Assistente alla registrazione',
    },
  },
  navigation: {
    scan_qr_code: 'Scansiona il codice QR',
    consultations: 'Consultazioni',
    patient_list: 'Elenco pazienti',
    personal_info: 'Informazioni personali',
    summary: 'Sommario',
    final_diagnoses: 'Diagnosi finali',
    questions: 'Domande',
    consent_list: 'File di consenso',
    current_consultation: 'Consultazione in corso',
    home: 'Home',
    synchronization: 'Sincronizzazione',
    welcome: 'Benvenuto',
    settings: 'Impostazioni',
    about: 'Riguardo',
    synchronize: 'Sincronizzare',
    logout: 'Logout',
  },
  patient: {
    first_name: 'Nome',
    last_name: 'Cognome',
    birth_date: 'Data di nascita',
    gender: 'Genere',
    estimated_age: 'Età stimata',
    reason: 'Motivo del cambio struttura',
    readable_birth_date: {
      days: '{{value}} giorni fa',
      weeks: '{{value}} settimane fa',
      months: '{{value}} mesi fa',
      years: '{{value}} anni fa',
    },
  },
  medical_case: {
    comment: 'Commento',
  },
  permissions: {
    message:
      "È necessario concedere le autorizzazioni pertinenti affinché l'app funzioni.",
    instructions:
      'Vai su Autorizzazioni nelle Impostazioni del tablet e concedi tutte le autorizzazioni richieste',
  },
  formulations: {
    drug: {
      give: 'Dare',
      mg: 'mg',
      caps: 'capsula(e) di',
      every: 'ogni',
      h: 'ora(e) per',
      hour: 'ora(e)',
      days: 'giorno(i)',
      mode: 'Modalità',
      tablet: 'tablet di',
      d: 'durata',
      during: 'durante',
      pre_referral: 'pre-riferimento',
      admin: 'Amministrazione',
      ml: 'ml',
      of: 'di',
      tablets: 'tablet(s)',
      capsules: 'capsula(e)',
      inhaler: 'inalazione(i)',
      patch: 'cerotto(i)',
      spray: 'spray',
      pessary: 'pessario(i)',
      no_formulation: ' Nessuna formulazione selezionata',
      missing_medicine_formulation: 'Selezionare una formulazione medicinale',
      no_options: 'Nessuna opzione compatibile',
      medication_form_not_handled: 'Modulo farmaci non gestito',
    },
    medication_form: {
      tablet: 'Tablet',
      dispersible_tablet: 'Compressa dispersibile',
      capsule: 'Capsula',
      syrup: 'Sciroppo',
      suspension: 'Sospensione',
      suppository: 'Supposta',
      drops: 'Gocce',
      solution: 'Soluzione',
      powder_for_injection: 'Polvere per iniezione',
      patch: 'Cerotto',
      cream: 'Crema',
      lotion: 'Lozione',
      pessary: 'Pessario',
      ointment: 'Unguento',
      gel: 'Gel',
      spray: 'Spray',
      inhaler: 'Inalatore',
      per: 'per',
      per_administration: 'per amministrazione',
      per_application: 'applicazione/i per amministrazione',
    },
  },
  reference_table: {
    above: '{{number}} o superiore',
    lower: '{{number}} o inferiore',
    between: 'Tra {{number_1}} e {{number_2}}',
  },
  validation: {
    is_required: 'Il campo "{{ field }}" è obbligatorio',
    consent_file_blank:
      'Il consenso al trattamento dei dati non può essere vuoto',
    final_diagnoses_required: 'Accetta o rifiuta tutte le diagnosi proposte',
    medicines_required: 'Accetta o rifiuta tutte le medicine',
    formulation_required: 'Scegli una formulazione per ogni medicinale',
  },
}
