/**
 * The external imports
 */
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Database, Q } from '@nozbe/watermelondb'
import { useSelector } from 'react-redux'
/**
 * The internal imports
 */
import schema from './Schema'

import {
  ActivityModel,
  PatientModel,
  PatientValueModel,
  MedicalCaseModel,
} from './Models'

const adapter = new SQLiteAdapter({
  schema,
})

const database = new Database({
  adapter,
  modelClasses: [
    ActivityModel,
    MedicalCaseModel,
    PatientModel,
    PatientValueModel,
  ],
  actionsEnabled: true,
})

export default function () {
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithm = useSelector(state => state.algorithm.item)
  const architecture = healthFacility.architecture

  /**
   * Create activities for a releated medical case
   * @param { array } activities - List of activities to create
   * @param { integer } medicalCaseId
   * @private
   */
  const _generateActivities = async (activities, medicalCaseId) => {
    //   await database.action(async () => {
    //     activities.map(async activity => {
    //       await database.batch(
    //         database.get('activities').prepareCreate(record => {
    //           record._raw.id = activity.id
    //           record.stage = activity.stage
    //           record.clinician = activity.clinician
    //           record.nodes = activity.nodes
    //           record.mac_address = activity.mac_address
    //           record.medical_case_id = medicalCaseId
    //           record.fail_safe = activity.fail_safe
    //         }),
    //       )
    //     })
    //   }, 'generate activities')
  }

  /**
   * Generate an object than contains all the data needed to display consent list
   * @param data
   * @param columns
   * @returns {Promise<*>}
   * @private
   */
  const _generateConsentList = async (data, columns) => {
    // return Promise.all(
    //   data.map(async entry => {
    //     const values = await Promise.all(
    //       columns.map(nodeId => entry.getLabelFromNode(nodeId, algorithm)),
    //     )
    //     return {
    //       id: entry.id,
    //       consent_file: entry.consent_file,
    //       values,
    //     }
    //   }),
    // )
  }

  /**
   * Generate query with filters
   * @param {object} filters - Filter object with key and value
   * @returns {string}
   * @private
   */
  const _generateFilteredQuery = (model, filters) => {
    // let query = ''
    // if (!_.isEmpty(filters)) {
    //   Object.keys(filters).forEach((nodeId, key) => {
    //     filters[nodeId].map((filter, filterKey) => {
    //       query +=
    //         model === 'MedicalCase'
    //           ? `status == "${filter}"`
    //           : `(patientValues.node_id == ${nodeId} AND patientValues.answer_id == ${filter})`
    //       if (filterKey + 1 < filters[nodeId].length) {
    //         query += ' OR '
    //       }
    //     })
    //     if (key + 1 < Object.keys(filters).length) {
    //       query += ' AND '
    //     }
    //   })
    // }
    // return query
  }

  /**
   * Generate an object than contains all the data needed to display a model in a list
   * @param data : an array of of the model we want to display
   * @param model : name of the model we wanna display
   * @param columns : array of node id for getting value
   * @returns { Array[Object] } : The array used to display values in the list
   * @private
   */
  const _generateList = async (data, model, columns) => {
    // return Promise.all(
    //   data.map(async entry => {
    //     if (model === 'Patient') {
    //       const values = await Promise.all(
    //         columns.map(nodeId => entry.getLabelFromNode(nodeId, algorithm)),
    //       )
    //       return {
    //         id: entry.id,
    //         updated_at: entry.updated_at,
    //         values,
    //       }
    //     }
    //     const values = await Promise.all(
    //       columns.map(nodeId => entry.getLabelFromNode(nodeId, algorithm)),
    //     )
    //     return {
    //       id: entry.id,
    //       status: entry.status,
    //       clinician: entry.clinician,
    //       mac_address: entry.mac_address,
    //       updated_at: entry.updated_at,
    //       values,
    //     }
    //   }),
    // )
  }

  /**
   * Returns the medical case
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   * @returns { MedicalCaseModel } returns the medical case
   * @private
   */
  const _getMedicalCaseFromModel = async (model, object) => {
    // switch (model) {
    //   case 'MedicalCase':
    //     return object
    //   case 'Patient':
    //     const medicalCases = await object.medicalCases
    //     return _initClasses(
    //       medicalCases[medicalCases.length - 1],
    //       'MedicalCase',
    //     )
    //   default:
    //     console.error('Wrong model :', model, object)
    // }
  }

  /**
   * Generate class
   * @param { array|object } data - Data retrieved from server
   * @param { string } model - Class name
   * @returns {Promise<[]|PatientModel|MedicalCaseModel>}
   * @private
   */
  const _initClasses = async (data, model) => {
    // let object = []
    // const environment = useSelector(state => state.system.environment)
    // if (model === 'Patient') {
    //   if (data instanceof Array) {
    //     object = Promise.all(
    //       data.map(async item => {
    //         let patientValues = await item.patientValues
    //         patientValues = patientValues?.map(
    //           patientValue => new PatientValueModel(patientValue),
    //         )
    //         item = {
    //           ...item._raw,
    //           id: item.id,
    //           patientValues,
    //           medicalCases: item.medicalCases,
    //         }
    //         return new PatientModel(item, environment)
    //       }),
    //     )
    //   } else {
    //     let patientValues = await data.patientValues
    //     patientValues = patientValues?.map(
    //       patientValue => new PatientValueModel(patientValue),
    //     )
    //     data = {
    //       ...data._raw,
    //       id: data.id,
    //       patientValues,
    //       medicalCases: data.medicalCases,
    //     }
    //     return new PatientModel(data, environment)
    //   }
    // } else if (data instanceof Array) {
    //   data.forEach(item => {
    //     object.push(new MedicalCaseModel(item))
    //   })
    // } else {
    //   return new MedicalCaseModel(data)
    // }
    // return object
  }

  /**
   * Map model to Watermelon table
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { string } - watermelon table name
   * @private
   */
  const _mapModelToTable = model => {
    // switch (model) {
    //   case 'Patient':
    //     return 'patients'
    //   case 'MedicalCase':
    //     return 'medical_cases'
    //   case 'PatientValue':
    //     return 'patient_values'
    //   case 'Activity':
    //     return 'activities'
    //   default:
    //     console.log("Watermelon table doesn't exist", model)
    // }
  }

  /**
   * Saves the patient values based on the activities on the object
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   * @private
   */
  const _savePatientValue = async (model, object) => {
    // const medicalCase = await _getMedicalCaseFromModel(model, object)
    // // Will update the patient values based on activities so we only take the edits
    // const activities = await medicalCase.activities
    // const nodeActivities = JSON.parse(activities[activities.length - 1].nodes)
    // if (nodeActivities.length > 0) {
    //   await database.action(async () => {
    //     database.batch(
    //       ...nodeActivities.map(node => {
    //         if (
    //           [
    //             Config.CATEGORIES.demographic,
    //             Config.CATEGORIES.basicDemographic,
    //           ].includes(medicalCase.nodes[node.id].category)
    //         ) {
    //           const patientValuesCollection = database.get('patient_values')
    //           return patientValuesCollection.prepareCreate(record => {
    //             record._raw.id = uuid.v4()
    //             record.value = node.value
    //             record.node_id = parseInt(node.id)
    //             record.answer_id =
    //               node.answer === null ? null : parseInt(node.answer)
    //             record.patient_id = medicalCase.patient_id
    //           })
    //         }
    //       }),
    //     )
    //   }, 'create patient values')
    // }
  }

  /**
   * Clear all table
   * @returns {Promise<void>}
   */
  const clearDatabase = async () => {
    // const patientsToDelete = await getAll('Patient', null, null, true)
    // // await delete patientsToDelete
    // const medicalCasesToDelete = await getAll('MedicalCase', null, null, true)
    // // await delete medicalCasesToDelete
    // const patientValuesToDelete = await getAll('PatientValue', null, null, true)
    // // await delete patientValuesToDelete
    // const activitiesToDelete = await getAll('Activity', null, null, true)
    // // await delete activitiesToDelete
  }

  /**
   * Finds a object based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - The wanted object
   */
  const findBy = async (model, value, field = 'id') => {
    // const collection = database.get(_mapModelToTable(model))
    // const object = await collection.query(Q.where(field, value))
    // return object[0] === undefined ? null : _initClasses(object[0], model)
  }

  /**
   * Deletes a specific object from the DB
   * @param { object } object - the object to delete
   */
  // const delete = async object => {
  //   await database.action(async () => {
  //     if (object instanceof Array) {
  //       object.forEach(o => o.destroyPermanently())
  //     } else {
  //       object.destroyPermanently()
  //     }
  //   })
  // }

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Used for pagination,tells what page to show
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  const getAll = async (model, page = null, params, rawData = false) => {
    // const collection = database.get(_mapModelToTable(model))
    // let result = await collection.query().fetch()
    // const queries = []
    // if (page === null) {
    //   if (!rawData) {
    //     result = await _initClasses(result, model)
    //   }
    //   return result
    // }
    // // const filters = _generateFilteredQuery(model, params.filters)
    // if (params.query !== '' && model === 'Patient') {
    //   queries.push(
    //     Q.on(
    //       'patient_values',
    //       'value',
    //       Q.like(`%${Q.sanitizeLikeString(params.query)}%`),
    //     ),
    //   )
    // }
    // // if (filters !== '') result = await result.filtered(filters);
    // queries.push(Q.experimentalSortBy('updated_at', Q.asc))
    // queries.push(Q.experimentalSkip((page - 1) * Config.ELEMENT_PER_PAGE))
    // queries.push(Q.experimentalTake(Config.ELEMENT_PER_PAGE * page))
    // console.log(page, result, queries)
    // result = await collection.query(...queries)
    // result = await _initClasses(result, model)
    // return _generateList(result, model, params.columns)
  }

  /**
   * Fetch patient with consent file
   * @param { integer } page
   * @param { array } columns - Columns to fetch values
   * @returns {Promise<*>}
   */
  const getConsentsFile = async (page, columns) => {
    // const queries = []
    // const collection = database.get('patients')
    // let result = await collection.query().fetch()
    // if (page === null) {
    //   return result
    // }
    // queries.push(Q.experimentalSortBy('updated_at', Q.asc))
    // queries.push(Q.experimentalSkip((page - 1) * Config.ELEMENT_PER_PAGE))
    // queries.push(Q.experimentalTake(Config.ELEMENT_PER_PAGE * page))
    // result = await collection.query(...queries)
    // result = await _initClasses(result, 'Patient')
    // return _generateConsentList(result, columns)
  }

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  const insert = async (model, object) => {
    // const collection = database.get(_mapModelToTable(model))
    // let patient = null
    // if (architecture === 'client_server') {
    //   object = { ...object, fail_safe: true }
    // }
    // await database.action(async () => {
    //   patient = await collection.create(record => {
    //     record._raw.id = object.id
    //     record.uid = object.uid
    //     record.study_id = object.study_id
    //     record.group_id = object.group_id
    //     record.other_uid = object.other_uid
    //     record.other_study_id = object.other_study_id
    //     record.other_group_id = object.other_group_id
    //     record.reason = object.reason
    //     record.consent = object.medicalCases[0].consent
    //     record.consent_file = object.consent_file
    //     record.fail_safe = object.fail_safe
    //   })
    // }, 'create patient')
    // const nestedCollection = database.get('medical_cases')
    // // MedicalCase
    // await database.action(async () => {
    //   object.medicalCases.map(async medicalCase => {
    //     await nestedCollection.create(nestedRecord => {
    //       nestedRecord._raw.id = medicalCase.id
    //       nestedRecord.json = medicalCase.json
    //       nestedRecord.synchronized_at = medicalCase.synchronized_at
    //       nestedRecord.status = medicalCase.status
    //       nestedRecord.fail_safe = object.fail_safe
    //       nestedRecord.patient.set(patient)
    //     })
    //     await _generateActivities(medicalCase.activities, medicalCase.id)
    //   })
    // }, 'create medicalCases')
    // await Promise.all([_savePatientValue(model, object)])
  }

  /**
   * Blank method used in httpInterface
   */
  const lockMedicalCase = () => {}

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @returns { Collection } - Updated object
   */
  const push = async (model, id, field, value) => {
    // const object = await findBy(model, id)
    // if (architecture === 'client_server') {
    //   value = { ...value, fail_safe: true }
    // }
    // if (field === 'medicalCases') {
    //   const collection = database.get('medical_cases')
    //   // MedicalCase
    //   await database.action(async action => {
    //     await collection.create(record => {
    //       record._raw.id = value.id
    //       record.json = value.json
    //       record.synchronized_at = value.synchronized_at
    //       record.status = value.status
    //       record.fail_safe = value.fail_safe
    //       record.patient_id = id
    //     })
    //     await action.subAction(() =>
    //       _generateActivities(value.activities, value.id),
    //     )
    //   }, 'push medicalCase')
    //   await Promise.all([_savePatientValue(model, object)])
    // }
  }

  /**
   * Blank method used in httpInterface
   */
  const unlockMedicalCase = () => {}

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @param { boolean } updatePatientValue - Flag that tells us if we need to update the patient values
   * @returns { Collection } - Updated object
   */
  const update = async (model, id, fields, updatePatientValue) => {
    // const collection = database.get(_mapModelToTable(model))
    // if (architecture === 'client_server') {
    //   fields = { ...fields, fail_safe: true }
    // }
    // const object = await collection.find(id)
    // await database.action(async () => {
    //   Object.keys(fields).map(async field => {
    //     await database.batch(
    //       object.prepareUpdate(record => {
    //         if (field !== 'patient' && field !== 'activities') {
    //           record[field] = fields[field]
    //         }
    //       }),
    //     )
    //   })
    // })
    // // Update patient updated_at value
    // if (model === 'MedicalCase') {
    //   await database.action(async () => {
    //     const patientCollection = database.get('patients')
    //     const patient = await patientCollection.find(object.patient_id)
    //     await patient.update(record => (record.updated_at = moment().toDate()))
    //   })
    // }
    // if (
    //   updatePatientValue &&
    //   !Object.keys(fields).includes('patientValues') &&
    //   ['Patient', 'MedicalCase'].includes(model)
    // ) {
    //   _savePatientValue(model, object)
    // }
  }

  /**
   * Finds a collection of objects based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - A collection of wanted values
   */
  const where = async (model, value, field) => {}

  /**
   * Get all closed and not synchronized case
   * @returns {Promise<Realm.Results<Realm.Object>>}
   */
  const closedAndNotSynchronized = async () => {
    // const collection = database.get('medical_cases')
    // return collection
    //   .query(Q.where('status', 'close'), Q.where('synchronized_at', null))
    //   .fetch()
  }

  return {
    clearDatabase,
    findBy,
    getAll,
    getConsentsFile,
    insert,
    lockMedicalCase,
    push,
    unlockMedicalCase,
    update,
    where,
    closedAndNotSynchronized,
  }
}
