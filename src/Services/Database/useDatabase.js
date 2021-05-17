/**
 * The external imports
 */
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import Config from '@/Config'

// import RemoteInterface from './Remote'
import useLocalInterface from './Local/useLocalInterface'

export default function () {
  const healthFacility = useSelector(state => state.healthFacility.item)
  const architecture = healthFacility.architecture

  /**
   * Define interface by connection and group architecture
   * @returns {string} interface to use
   * @private
   */
  const _checkInterface = async () => {
    let dbInterface
    const network = useSelector(state => state.network)
    if (architecture === 'standalone' || !network.isConnected) {
      dbInterface = Config.DATABASE_INTERFACE.local
    } else {
      dbInterface = Config.DATABASE_INTERFACE.remote
    }
    return dbInterface
  }

  const dataInterface =
    _checkInterface() === 'local' ? useLocalInterface() : useLocalInterface()

  /**
   * Fetch single entry
   * @param { string } model - The model name of the data we want to retrieve
   * @param { string } value - The value of the object we want
   * @param { string } field - the field we wanna search on
   * @returns { collection } - Object fetch
   */
  const findBy = async (model, value, field = 'id') => {
    return dataInterface.findBy(model, value, field)
  }

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Pagination. if null, retrieved all information
   * @param { integer } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  const getAll = async (model, page, params = { query: '', filters: [] }) => {
    console.log(dataInterface)
    return dataInterface.getAll(model, page, params)
  }

  /**
   * Get all consent file for all users
   * @returns {Promise<string|Array>}
   */
  const getConsentsFile = async (page, columns) => {
    return dataInterface.getConsentsFile(page, columns)
  }

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  const insert = async (model, object) => {
    return dataInterface.insert(model, object)
  }

  /**
   * Lock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const lockMedicalCase = async id => {
    return dataInterface.lockMedicalCase(id)
  }

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @return { object } object - The value of the object
   */
  const push = async (model, id, field, value) => {
    return dataInterface.push(model, id, field, value)
  }

  /**
   * Unlock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  const unlockMedicalCase = async id => {
    return dataInterface.unlockMedicalCase(id)
  }

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @param { boolean } updatePatientValue - Flag that tells us if we need to update the patient values
   * @return { object } object - The value of the object
   */
  const update = async (model, id, fields, updatePatientValue = false) => {
    return dataInterface.update(model, id, fields, updatePatientValue)
  }

  /**
   * Finds a collection of objects based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - A collection of wanted values
   */
  const where = async (model, value, field) => {
    return dataInterface.where(model, value, field)
  }

  return {
    findBy,
    getAll,
    getConsentsFile,
    insert,
    lockMedicalCase,
    push,
    update,
    unlockMedicalCase,
    where,
  }
}
