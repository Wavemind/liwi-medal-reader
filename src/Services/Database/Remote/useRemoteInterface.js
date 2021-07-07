/**
 * The external imports
 */

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
    const stringFilters = _generateFiltersUrl(params.filters)
    const url = `/api/${_mapModelToRoute(model)}?page=${page}&query=${
      params.query
    }${stringFilters !== '' ? `&filter=${stringFilters}` : ''}`

    const response = await api.get(url)
    return response.data.data
  }

  /**
   * Get all consent file for all users
   * @returns {Promise<string|Array>}
   */
  const getConsentsFile = async page => {
    const response = await api.post('/api/patients/consent_files', { page })
    return response.data.data
  }

  /**
   * Returns the entry of a specific model with an id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { string } value - Value to find in database row
   * @param { string } field - database column
   * @returns { Collection } - The wanted object
   */
  const findBy = async (model, value, field) => {
    const url = `/api/${_mapModelToRoute(
      model,
    )}/find_by?field=${field}&value=${value}`

    const response = await api.get(url)
    return response.data.data
  }

  /**
   * Create activities for a related medical case
   * @param { integer } medicalCaseId
   * @param { array } activities - List of activities to create
   * @private
   */
  const insertActivities = async (medicalCaseId, activities) => {
    const response = await api.post(
      `/api/medical_cases/${medicalCaseId}/activities`,
      activities,
    )
    return response.data.data
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
      medicalCaseData,
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
      medical_case: medicalCaseData,
      patient: patientData,
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
      patientValues,
    )
    return response.data.data
  }

  /**
   * lock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const lockMedicalCase = async id => {
    const response = await api.post(`/api/medical_cases/${id}/lock`)
    return response.data.data
  }

  /**
   * Unlock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const unlockMedicalCase = async id => {
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
    const response = await api.patch(
      `/api/${_mapModelToRoute(model)}/${id}`,
      fields,
    )
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

  /**
   * Generate an URL with filters object
   * @param {object} filters - Filter object with key and value
   * @returns {string}
   * @private
   */
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

  return {
    findBy,
    insertActivities,
    insertPatient,
    insertPatientValues,
    getAll,
    update,
    insertMedicalCase,
    lockMedicalCase,
    unlockMedicalCase,
    synchronizePatients,
    getConsentsFile,
  }
}
