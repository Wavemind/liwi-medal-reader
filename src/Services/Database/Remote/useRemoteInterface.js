/**
 * The internal imports
 */
import api from '@/Services/Database/Remote'

export default function () {
  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Pagination. if null, retrieved all information
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  const getAll = async (model, page, params) => {
    let stringFilters = ''
    let stringQuery = ''

    if (params) {
      stringFilters = _generateFiltersUrl(params.filters)
      stringQuery = params.terms
    }

    // TODO Terms
    let url = `/api/${_mapModelToRoute(model)}?page=${page}&params={`
    url += stringQuery ? `terms: '${stringQuery}'` : ''
    url += stringFilters ? `filters: '${stringFilters}'` : ''
    url += '}'

    const response = await api.get(url)

    return _initClasses(response.data.data, model)
  }

  /**
   * Get all consent file for all users
   * @returns {Promise<string|Array>}
   */
  const getConsentsFile = async page => {
    // TODO TEST IT
    const response = await api.get('/api/patients/consent_files', { page })
    return response.data.data
  }

  /**
   * Returns the entry of a specific model with an id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { string } value - Value to find in database row
   * @param { string } field - database column
   * @returns { Collection } - The wanted object
   */
  const findBy = async (model, value, field = 'id') => {
    const url = `/api/${_mapModelToRoute(
      model,
    )}/find_by?field=${field}&value=${value}`

    const response = await api.get(url)
    return _initClasses(response.data.data, model)
  }

  /**
   * Create activities for a related medical case
   * @param { integer } medicalCaseId
   * @param { array } activities - List of activities to create
   * @private
   */
  const insertActivities = async (medicalCaseId, activities) => {
    if (activities.length > 0) {
      const response = await api.post(
        `/api/medical_cases/${medicalCaseId}/activities`,
        { activities },
      )
      return response.data.data
    }
  }

  /**
   * Inserts a new medical case into the DB
   * @param patientId
   * @param medicalCaseData
   * @returns {Promise<void>}
   */
  const insertMedicalCase = async (patientId, medicalCaseData) => {
    const response = await api.post(
      `/api/patients/${patientId}/medical_cases`,
      {
        medical_case: {
          ...medicalCaseData,
          json: {
            comment: medicalCaseData.comment,
            consent: medicalCaseData.consent,
            diagnosis: medicalCaseData.diagnosis,
            nodes: medicalCaseData.nodes,
          },
        },
      },
    )
    return response.data.data
  }

  /**
   * Inserts the patient values to the DB.
   * @param patientValues
   * @param patientId
   * @returns {Promise<void>}
   */
  const insertPatient = async (patientData, medicalCaseData) => {
    const response = await api.post('/api/patients', {
      medical_case: {
        id: medicalCaseData.id,
        json: {
          comment: medicalCaseData.comment,
          consent: medicalCaseData.consent,
          diagnosis: medicalCaseData.diagnosis,
          nodes: medicalCaseData.nodes,
        },
        json_version: medicalCaseData.json_version,
        advancement: medicalCaseData.advancement,
        synchronizedAt: medicalCaseData.synchronizedAt,
        closedAt: medicalCaseData.closedAt,
        fail_safe: false,
        version_id: medicalCaseData.version_id,
      },
      patient: {
        id: patientData.id,
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        birth_date: patientData.birth_date,
        birth_date_estimated: patientData.birth_date_estimated,
        uid: patientData.uid,
        study_id: patientData.study_id,
        group_id: patientData.group_id,
        other_uid: patientData.other_uid,
        other_study_id: patientData.other_study_id,
        other_group_id: patientData.other_group_id,
        reason: patientData.reason,
        consent: patientData.consent,
        consent_file: patientData.consent_file,
        fail_safe: false,
      },
    })

    return response.data.data
  }

  /**
   * Inserts the patient values to the DB.
   * @param patientValues
   * @param patientId
   * @returns {Promise<void>}
   */
  const insertPatientValues = async (patientValues, patientId) => {
    const response = await api.post(
      `/api/patients/${patientId}/patient_values`,
      {
        patient_values: patientValues.map(patientValue => ({
          node_id: patientValue.id,
          answer_id: patientValue.answer,
          value: patientValue.value,
        })),
      },
    )
    return response.data.data
  }

  /**
   * lock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const lock = async id => {
    const response = await api.post(`/api/medical_cases/${id}/lock`)
    return response.data.data
  }

  /**
   * Unlock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const unlock = async id => {
    const response = await api.post(`/api/medical_cases/${id}/unlock`)
    return response.data.data
  }

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @returns { Collection } - Updated object
   */
  const update = async (model, id, fields) => {
    const response = await api.patch(`/api/${_mapModelToRoute(model)}/${id}`, {
      fields,
    })
    return response.data.data
  }

  /**
   * Synchronize patients and medical cases with local data
   * @param patients
   * @returns {Promise<string|Array>}
   */
  const synchronizePatients = async patients => {
    const response = await api.post('/api/patients/synchronize', patients)
    return response.data.data
  }

  /**
   * Map model to local data route
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { string } - local data route
   * @private
   */
  const _mapModelToRoute = model => {
    let route = ''
    switch (model) {
      case 'Patient':
        route = 'patients'
        break
      case 'MedicalCase':
        route = 'medical_cases'
        break
      default:
        console.warn("route doesn't exist", model)
    }
    return route
  }

  const _buildMedicalCase = remoteMedicalCase => {
    const parsedJson = JSON.parse(remoteMedicalCase.json)
    const medicalCase = {
      id: remoteMedicalCase.id,
      activities: [],
      comment: parsedJson.comment,
      consent: parsedJson.consent,
      diagnosis: parsedJson.diagnosis,
      nodes: parsedJson.nodes,
      json: null,
      // TODO Check if JSON_version is stored
      json_version: remoteMedicalCase.json_version,
      clinician: remoteMedicalCase.clinician,
      mac_address: remoteMedicalCase.mac_address,
      advancement: {
        stage: remoteMedicalCase.advancement.stage,
        step: remoteMedicalCase.advancement.step,
      },
      fail_safe: remoteMedicalCase.fail_safe,
      createdAt: remoteMedicalCase.created_at,
      updatedAt: remoteMedicalCase.updated_at,
      closedAt: remoteMedicalCase.closedAt,
      version_id: remoteMedicalCase.version_id,
      patient_id: remoteMedicalCase.patient_id,
    }
    return medicalCase
  }

  const _buildPatient = remotePatient => {
    // Build medicalCases
    const medicalCases = remotePatient.medical_cases.map(remoteMedicalCase =>
      _buildMedicalCase(remoteMedicalCase, false),
    )

    // Build patient
    const patient = {
      first_name: remotePatient.first_name,
      last_name: remotePatient.last_name,
      birth_date: remotePatient.birth_date,
      birth_date_estimated: remotePatient.birth_date_estimated,
      birth_date_estimated_type: remotePatient.birth_date_estimated_type,
      consent: remotePatient.consent,
      consent_file: remotePatient.consent_file,
      createdAt: remotePatient.created_at,
      fail_safe: remotePatient.fail_safe,
      group_id: remotePatient.group_id,
      id: remotePatient.id,
      other_group_id: remotePatient.other_group_id,
      other_study_id: remotePatient.other_study_id,
      other_uid: remotePatient.other_uid,
      reason: remotePatient.reason,
      savedInDatabase: true,
      study_id: remotePatient.study_id,
      uid: remotePatient.uid,
      updatedAt: remotePatient.updated_at,
    }

    return {
      ...patient,
      patientValues: remotePatient.patient_values,
      medicalCases: medicalCases,
    }
  }

  /**
   * Generate an URL with filters object
   * @param {object} filters - Filter object with key and value
   * @returns {string}
   * @private
   */
  // TODO make it work
  const _generateFiltersUrl = filters => {
    let stringFilters = ''
    if (filters.length !== 0) {
      Object.keys(filters).forEach((nodeId, key) => {
        stringFilters += `${nodeId}:`
        filters[nodeId].map((filter, filterKey) => {
          stringFilters += filter
          if (filterKey + 1 < filters[nodeId].length) {
            stringFilters += ','
          }
        })
        if (key + 1 < Object.keys(filters).length) {
          stringFilters += '|'
        }
      })
    }
    return stringFilters
  }

  const _buildMedicalCaseLight = remoteMedicalCase => {
    return {
      id: remoteMedicalCase.id,
      advancement: {
        stage: Number(remoteMedicalCase.advancement.stage),
        step: Number(remoteMedicalCase.advancement.step),
      },
      json: null,
      fail_safe: remoteMedicalCase.fail_safe,
      createdAt: remoteMedicalCase.created_at,
      updatedAt: remoteMedicalCase.updated_at,
      clinician: remoteMedicalCase.clinician,
      mac_address: remoteMedicalCase.mac_address,
      closedAt: remoteMedicalCase.closedAt,
      version_id: remoteMedicalCase.version_id,
      patient: {
        id: remoteMedicalCase.patient.id,
        first_name: remoteMedicalCase.patient.first_name,
        last_name: remoteMedicalCase.patient.last_name,
        birth_date: remoteMedicalCase.patient.birth_date,
      },
    }
  }

  /**
   * Generate class
   * @param { array|object } data - Data retrieved from server
   * @param { string } model - Class name
   * @returns {Promise<[]|PatientModel|MedicalCaseModel>}
   * @private
   */
  const _initClasses = (data, model) => {
    let object = []
    if (model === 'Patient') {
      if (data instanceof Array) {
        object = data.map(item => _buildPatient(item))
      } else {
        return _buildPatient(data)
      }
    } else if (data instanceof Array) {
      object = data.map(item => _buildMedicalCaseLight(item))
    } else {
      return _buildMedicalCase(data)
    }
    return object
  }

  return {
    findBy,
    insertActivities,
    insertPatient,
    insertPatientValues,
    updatePatientValues: insertPatientValues,
    getAll,
    update,
    insertMedicalCase,
    lock,
    unlock,
    synchronizePatients,
    getConsentsFile,
  }
}
