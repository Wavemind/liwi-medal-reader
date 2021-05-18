/**
 * The external imports
 */
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */

export default function () {
  const healthFacility = useSelector(state => state.healthFacility.item)
  const macAddress = useSelector(state => state.device.item.mac_addresss)
  const localDataIp = healthFacility.local_data_ip
  const clinician = _setClinician()

  const _setClinician = () => {
    const user = useSelector(state => state.healthFacility.clinician)
    return user ? `${user.first_name} ${user.last_name}` : null
  }

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  const insert = async (model, object) => {
    // const url = `${localDataIp}/api/${_mapModelToRoute(model)}`
    // const header = await _setHeaders('POST', object)
    // return _fetch(url, header)
  }

  /**
   * Returns the entry of a specific model with an id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { string } value - Value to find in database row
   * @param { string } field - database column
   * @returns { Collection } - The wanted object
   */
  const findBy = async (model, value, field) => {
    // const url = `${localDataIp}/api/${_mapModelToRoute(
    //   model,
    // )}/find_by?field=${field}&value=${value}`
    // const header = await _setHeaders()
    // const data = await _fetch(url, header)
    // if (data !== null) {
    //   // TODO probably don't want to create Object
    //   //return _initClasses(data, model)
    // }
    // return data
  }

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Pagination. if null, retrieved all information
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  const getAll = async (model, page, params) => {
    // const stringFilters = _generateFiltersUrl(params.filters)
    // const url = `${localDataIp}/api/${_mapModelToRoute(
    //   model,
    // )}?page=${page}&query=${params.query}${
    //   stringFilters !== '' ? `&filter=${stringFilters}` : ''
    // }`
    // const header = await _setHeaders()
    // return _fetch(url, header)
  }

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @param { boolean } updatePatientValue - Used only in RealmInterface
   * @returns { Collection } - Updated object
   */
  const update = async (model, id, fields, updatePatientValue) => {
    // const url = `${localDataIp}/api/${_mapModelToRoute(model)}/${id}`
    // const header = await _setHeaders('PUT', fields)
    // return _fetch(url, header)
  }

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @returns { Collection } - Updated object
   */
  const push = async (model, id, field, value) => {
    // const url = `${localDataIp}/api/${_mapModelToRoute(model)}/${id}`
    // const header = await _setHeaders('PUT', { [field]: value })
    // return _fetch(url, header)
  }

  /**
   * Unlock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const unlockMedicalCase = async id => {
    // const url = `${localDataIp}/api/medical_cases/${id}/unlock`
    // const header = await _setHeaders()
    // return _fetch(url, header)
  }

  /**
   * lock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const lockMedicalCase = async id => {
    // const url = `${localDataIp}/api/medical_cases/${id}/lock`
    // const header = await _setHeaders()
    // return _fetch(url, header)
  }

  /**
   * Synchronize patients and medical cases with local data
   * @param patients
   * @returns {Promise<string|Array>}
   */
  const synchronizePatients = async patients => {
    // const url = `${localDataIp}/api/patients/synchronize`
    // const header = await _setHeaders('POST', { patients })
    // return _fetch(url, header)
  }

  /**
   * Get all consent file for all users
   * @returns {Promise<string|Array>}
   */
  const getConsentsFile = async page => {
    // const url = `${localDataIp}/api/patients/consents_file?page=${page}`
    // const header = await _setHeaders()
    // return _fetch(url, header)
  }

  /**
   * Make the request and parse result
   * @param { string } url - Url to bind
   * @param { object } header - Header options
   * @returns {Promise<string|array>}
   * @private
   */
  const _fetch = async (url, header) => {
    // const httpRequest = await fetch(url, header).catch(error => {
    //   handleHttpError(error)
    // })
    // // In case of fetch timeout
    // if (httpRequest !== undefined) {
    //   const result = await httpRequest.json()
    //   if (httpRequest.status === 200) {
    //     return result
    //   }
    //   if (httpRequest.status > 404) {
    //     handleHttpError(result.message)
    //   }
    // }
    // return null
  }

  /**
   * Map model to local data route
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { string } - local data route
   * @private
   */
  const _mapModelToRoute = model => {
    // let route = ''
    // switch (model) {
    //   case 'Patient':
    //     route = 'patients'
    //     break
    //   case 'MedicalCase':
    //     route = 'medical_cases'
    //     break
    //   default:
    //     console.warn("route doesn't exist", model)
    // }
    // return route
  }

  /**
   * Keeps the undefined values when Json.stringify
   */
  const _replacer = (key, value) =>
    typeof value === 'undefined' ? null : value

  /**
   * Set header credentials to communicate with server
   * @params [String] method
   * @params [Object] body
   * @return [Object] header
   * @private
   */
  const _setHeaders = async (method = 'GET', body = false) => {
    // if (clinician === null) {
    //   await _setClinician()
    // }
    // const header = {
    //   method,
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'x-mac-address': macAddress,
    //     'x-clinician': clinician,
    //   },
    // }
    // if (
    //   method === 'POST' ||
    //   method === 'PATCH' ||
    //   method === 'PUT' ||
    //   method === 'DELETE'
    // ) {
    //   header.body = JSON.stringify(body, _replacer)
    // }
    // return header
  }

  /**
   * Generate an URL with filters object
   * @param {object} filters - Filter object with key and value
   * @returns {string}
   * @private
   */
  const _generateFiltersUrl = filters => {
    // let stringFilters = ''
    // if (filters.length !== 0) {
    //   Object.keys(filters).forEach((nodeId, key) => {
    //     stringFilters += `${nodeId}:`
    //     filters[nodeId].map((filter, filterKey) => {
    //       stringFilters += filter
    //       if (filterKey + 1 < filters[nodeId].length) {
    //         stringFilters += ','
    //       }
    //     })
    //     if (key + 1 < Object.keys(filters).length) {
    //       stringFilters += '|'
    //     }
    //   })
    // }
    // return stringFilters
  }

  /**
   * Generate class
   * @param { array|object } data - Data retrieved from server
   * @param { string } model - Class name
   * @returns {Promise<[]|PatientModel|MedicalCaseModel>}
   * @private
   */

  // TODO Probably don't want to create objects
  //   const _initClasses = async (data, model) => {
  //     const object = []
  //     const environment = await getEnvironment()

  //     if (model === 'Patient') {
  //       if (data instanceof Array) {
  //         data.forEach(async item => {
  //           const newPatient = await new PatientModel(item, environment)
  //           object.push(newPatient)
  //         })
  //       } else {
  //         return new PatientModel(data, environment)
  //       }
  //     } else if (data instanceof Array) {
  //       data.forEach(item => {
  //         object.push(new MedicalCaseModel(item))
  //       })
  //     } else {
  //       return new MedicalCaseModel(data)
  //     }
  //     return object
  //   }

  return {
    insert,
    findBy,
    getAll,
    update,
    push,
    unlockMedicalCase,
    lockMedicalCase,
    synchronizePatients,
    getConsentsFile,
  }
}
