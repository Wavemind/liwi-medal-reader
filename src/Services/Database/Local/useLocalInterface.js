/**
 * The external imports
 */
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { Database, Q } from '@nozbe/watermelondb'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import schema from './Schema'
import migrations from './Models/Migrations'
import { Config } from '@/Config'
import { store } from '@/Store'
import {
  ActivityModel,
  PatientModel,
  PatientValueModel,
  MedicalCaseModel,
} from './Models'

let adapter = null

if (process.env.NODE_ENV === 'test') {
  adapter = new LokiJSAdapter({
    schema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  })
} else {
  adapter = new SQLiteAdapter({
    schema,
    migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  })
}

const database = new Database({
  adapter,
  modelClasses: [
    ActivityModel,
    MedicalCaseModel,
    PatientModel,
    PatientValueModel,
  ],
})

export default function () {
  /**
   * Gets the list of activities for a given medical case
   * @param medicalCaseId
   * @returns {Promise<*>}
   */
  const getActivities = async medicalCaseId => {
    const collection = database.get(_mapModelToTable('Activity'))
    let result = await collection
      .query(Q.where('medical_case_id', medicalCaseId))
      .fetch()

    return result.map(activity => ({
      id: activity._raw.id,
      step: activity.step,
      clinician: activity.clinician,
      nodes: JSON.parse(activity.nodes),
      device_id: activity.device_id,
      medical_case_id: activity.medical_case_id,
      fail_safe: activity.fail_safe,
    }))
  }

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Used for pagination,tells what page to show
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  const getAll = async (model, page = 1, params) => {
    const queries = []
    let filtersQuery = ''
    const collection = database.get(_mapModelToTable(model))
    let result = await collection.query().fetch()

    if (params) {
      if (params.terms) {
        // Search on last_name or first_name
        const searchQuery = Q.or(
          Q.where(
            'last_name',
            Q.like(`%${Q.sanitizeLikeString(params.terms)}%`),
          ),
          Q.where(
            'first_name',
            Q.like(`%${Q.sanitizeLikeString(params.terms)}%`),
          ),
        )

        // search on patient or use the relation
        if (model === 'Patient') {
          queries.push(searchQuery)
        } else if (model === 'MedicalCase') {
          queries.push(Q.on(_mapModelToTable('Patient'), [searchQuery]))
        }
      }

      if (params.filters && Object.keys(params.filters).length > 0) {
        Object.keys(params.filters).forEach((nodeId, key) => {
          params.filters[nodeId].map((filter, filterKey) => {
            filtersQuery += `(patient_values.node_id = ${nodeId} AND patient_values.answer_id = ${filter})`
            if (filterKey + 1 < params.filters[nodeId].length) {
              filtersQuery += ' OR '
            }
          })
          if (key + 1 < Object.keys(params.filters).length) {
            filtersQuery += ' AND '
          }
        })

        if (model === 'Patient') {
          queries.push(
            Q.on(_mapModelToTable('PatientValue'), [
              Q.unsafeSqlExpr(filtersQuery),
            ]),
          )
        } else {
          queries.push(
            Q.experimentalNestedJoin(
              _mapModelToTable('Patient'),
              _mapModelToTable('PatientValue'),
            ),
            Q.on(_mapModelToTable('Patient'), [
              Q.on(_mapModelToTable('PatientValue'), [
                Q.unsafeSqlExpr(filtersQuery),
              ]),
            ]),
          )
        }
      }
    }

    result = await collection.query(...queries)

    // Order by createdAt descending
    result = result.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )

    // Pagination
    result = result.slice(
      (page - 1) * Config.ELEMENT_PER_PAGE,
      Config.ELEMENT_PER_PAGE * page,
    )

    return _initClasses(result, model)
  }

  /**
   * Fetch patient with consent file
   * @param { integer } page
   * @returns {Promise<*>}
   */
  const getConsentsFile = async (page = 1) => {
    const collection = database.get('patients')
    let result = await collection.query().fetch()

    const queries = []

    result = await collection.query(...queries)

    // Order by createdAt descending
    result = result.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )

    result = result.filter(patient => !!patient.consent_file)

    // Pagination
    result = result.slice(
      (page - 1) * Config.ELEMENT_PER_PAGE,
      Config.ELEMENT_PER_PAGE * page,
    )
    return _initClasses(result, 'Patient')
  }

  /**
   * Gets all medical cases in the database
   * @returns {Promise<*[]|PatientModel|MedicalCaseModel>}
   */
  const getMedicalCases = async () => {
    const collection = database.get(_mapModelToTable('MedicalCase'))
    let result = await collection.query().fetch()
    return _initClasses(result, 'MedicalCase', false)
  }

  /**
   * Finds a object based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - The wanted object
   */
  const findBy = async (model, value, field = 'id') => {
    const collection = database.get(_mapModelToTable(model))
    const object = await collection.query(Q.where(field, value))
    return object[0] === undefined ? null : _initClasses(object[0], model)
  }

  /**
   * Create activities for a related medical case
   * @param { integer } medicalCaseId
   * @param { array } activities - List of activities to create
   * @private
   */
  const insertActivities = async (medicalCaseId, activities) => {
    const architecture = store.getState().healthFacility.item.architecture

    let failSafe = false

    if (architecture === 'client_server') {
      failSafe = true
    }

    await database.write(async () => {
      activities.map(async activity => {
        await database.batch(
          database.get('activities').prepareCreate(record => {
            record._raw.id = activity.id
            record.step = activity.step
            record.clinician = activity.clinician
            record.nodes = JSON.stringify(activity.nodes)
            record.device_id = activity.device_id
            record.medical_case_id = medicalCaseId
            record.fail_safe = failSafe
          }),
        )
      })
    }, 'insert activities')
  }

  /**
   * Inserts a new medical case into the DB
   * @param patientId
   * @param medicalCaseData
   * @returns {Promise<void>}
   */
  const insertMedicalCase = async (patientId, medicalCaseData) => {
    const patient = await findBy('Patient', patientId)
    const collection = database.get('medical_cases')
    const architecture = store.getState().healthFacility.item.architecture

    await _handleFailSafe()

    let failSafe = false
    if (architecture === 'client_server') {
      failSafe = true
    }

    await database.write(async () => {
      await collection.create(record => {
        record._raw.id = medicalCaseData.id
        record.json = JSON.stringify({
          comment: medicalCaseData.comment,
          consent: medicalCaseData.consent,
          diagnosis: medicalCaseData.diagnosis,
          nodes: medicalCaseData.nodes,
          metadata: {
            appVersion: medicalCaseData.appVersion,
          },
        })
        record.json_version = medicalCaseData.json_version
        record.stage = medicalCaseData.advancement.stage
        record.step = medicalCaseData.advancement.step
        record.synchronizedAt = medicalCaseData.synchronizedAt
        record.closedAt = medicalCaseData.closedAt
        record.fail_safe = failSafe
        record.version_id = medicalCaseData.version_id
        record.patient.set(patient)
      })
    }, 'create medical case')
  }

  /**
   * Insert patient and add a medical case
   * @param {object} patientData - patient info to save
   * @params {objet} medicalCaseData - medical case info to save
   */
  const insertPatient = async (patientData, medicalCaseData) => {
    const collection = database.get('patients')
    const architecture = store.getState().healthFacility.item.architecture

    let failSafe = false
    let patient = null

    if (architecture === 'client_server') {
      failSafe = true
    }

    await database.write(async () => {
      patient = await collection.create(record => {
        record._raw.id = patientData.id
        record.first_name = patientData.first_name
        record.last_name = patientData.last_name
        record.birth_date = patientData.birth_date
        record.birth_date_estimated = patientData.birth_date_estimated
        record.birth_date_estimated_type = patientData.birth_date_estimated_type
        record.uid = patientData.uid
        record.study_id = patientData.study_id
        record.group_id = String(patientData.group_id) // In case of fail safe, hub give us an integer instead of a string
        record.other_uid = patientData.other_uid
        record.other_study_id = patientData.other_study_id
        record.other_group_id = patientData.other_group_id
        record.reason = patientData.reason
        record.consent = patientData.consent
        record.consent_file = patientData.consent_file
        record.fail_safe = failSafe
      })
      const nestedCollection = database.get('medical_cases')
      await nestedCollection.create(nestedRecord => {
        nestedRecord._raw.id = medicalCaseData.id
        nestedRecord.json = JSON.stringify({
          comment: medicalCaseData.comment,
          consent: medicalCaseData.consent,
          diagnosis: medicalCaseData.diagnosis,
          nodes: medicalCaseData.nodes,
          metadata: {
            appVersion: medicalCaseData.appVersion,
          },
        })
        nestedRecord.json_version = medicalCaseData.json_version
        nestedRecord.stage = medicalCaseData.advancement.stage
        nestedRecord.step = medicalCaseData.advancement.step
        nestedRecord.synchronizedAt = medicalCaseData.synchronizedAt
        nestedRecord.closedAt = medicalCaseData.closedAt
        nestedRecord.fail_safe = failSafe
        nestedRecord.version_id = medicalCaseData.version_id
        nestedRecord.patient.set(patient)
      })
    }, 'create patient')
  }

  /**
   * Inserts the patient values to the DB.
   * @param patientValues
   * @param patientId
   * @returns {Promise<void>}
   */
  const insertPatientValues = async (patientValues, patientId) => {
    const patientValuesCollection = database.get('patient_values')
    const architecture = store.getState().healthFacility.item.architecture

    let failSafe = false

    if (architecture === 'client_server') {
      failSafe = true
    }

    await database.write(async () => {
      await database.batch(
        patientValues.map(patientValue =>
          patientValuesCollection.prepareCreate(record => {
            record._raw.id = uuid.v4()
            record.patient_id = patientId
            record.node_id = parseInt(patientValue.id, 10)
            record.answer_id = patientValue.answer
            record.value = patientValue.value?.toString()
            record.fail_safe = failSafe
          }),
        ),
      )
    }, 'insert patient values')
  }

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @returns { Collection } - Updated object
   */
  const update = async (model, id, fields) => {
    const collection = database.get(_mapModelToTable(model))
    const architecture = store.getState().healthFacility.item.architecture
    await _handleFailSafe()

    if (architecture === 'client_server') {
      fields = [...fields, { name: 'fail_safe', value: true }]
    }

    await database.write(async () => {
      const object = await collection.find(id)
      await database.batch(
        object.prepareUpdate(record => {
          fields.map(field => {
            record[field.name] = field.value
          })
        }),
      )
    })
  }

  const lock = () => {}
  const unlock = () => {}

  /**
   * Updates the patient values in the DB.
   * @param patientValues
   * @param patientId
   * @returns {Promise<void>}
   */
  const updatePatientValues = async (patientValues, patientId) => {
    const patientValuesCollection = database.get('patient_values')
    await database.write(async () => {
      const existingPatientValues = await patientValuesCollection
        .query(Q.where('patient_id', patientId))
        .fetch()
      await database.batch(
        existingPatientValues.map(patientValueRecord =>
          patientValueRecord.prepareUpdate(record => {
            const patientValue = patientValues.find(
              pv => record.node_id === pv.id,
            )
            record.answer_id = patientValue.answer
            record.value = patientValue.value?.toString()
          }),
        ),
      )
    }, 'update patient values')
  }

  /*
   * Will set the needed value in the database if we switch to fail Safe mode
   */
  const _handleFailSafe = async () => {
    const state = store.getState()
    const architecture = state.healthFacility.item.architecture
    const isConnected = state.network.isConnected
    const patient = state.patient.item
    const medicalCase = state.medicalCase.item

    if (architecture === 'client_server' && !isConnected) {
      // Find patient in Local Interface
      const patientExists = await findBy('Patient', patient.id)
      if (patientExists === null) {
        await insertPatient(patient, medicalCase)
      }
    }
  }

  /**
   * Destroy patient and related infos
   * @params patientId
   */
  const destroyPatient = async patientId => {
    const localPatient = await database.get('patients').find(patientId)

    const patientValues = await localPatient.patientValues.fetch()
    destroy(patientValues)

    const medicalCases = await localPatient.medicalCases.fetch()

    medicalCases.forEach(async medicalCase => {
      const activities = await medicalCase.activities.fetch()
      destroy(activities)
    })

    destroy(medicalCases)
    destroy(localPatient)
  }

  /**
   * Deletes a specific object from the DB
   * @param { object } object - the object to delete
   */
  const destroy = async object => {
    await database.write(async () => {
      if (object instanceof Array) {
        object.forEach(o => o.destroyPermanently())
      } else {
        object.destroyPermanently()
      }
    })
  }

  const _buildPatient = async watermelonDBPatient => {
    const watermelonDBMedicalCases =
      await watermelonDBPatient.medicalCases.fetch()
    const watermelonDBPatientValues =
      await watermelonDBPatient.patientValues.fetch()

    // Build medicalCases
    const medicalCases = await Promise.all(
      watermelonDBMedicalCases.map(
        async watermelonDBMedicalCase =>
          await _buildMedicalCase(watermelonDBMedicalCase, false),
      ),
    )

    // Build patient values
    const patientValues = watermelonDBPatientValues.map(
      watermelonDBPatientValue => _buildPatientValue(watermelonDBPatientValue),
    )

    // Build patient
    const patient = {
      first_name: watermelonDBPatient.first_name,
      last_name: watermelonDBPatient.last_name,
      birth_date: watermelonDBPatient.birth_date.getTime(),
      birth_date_estimated: watermelonDBPatient.birth_date_estimated,
      birth_date_estimated_type: watermelonDBPatient.birth_date_estimated_type,
      consent: watermelonDBPatient.consent,
      consent_file: watermelonDBPatient.consent_file,
      createdAt: watermelonDBPatient.createdAt.getTime(),
      fail_safe: watermelonDBPatient.fail_safe,
      group_id: watermelonDBPatient.group_id,
      id: watermelonDBPatient.id,
      other_group_id: watermelonDBPatient.other_group_id,
      other_study_id: watermelonDBPatient.other_study_id,
      other_uid: watermelonDBPatient.other_uid,
      reason: watermelonDBPatient.reason,
      savedInDatabase: true,
      study_id: watermelonDBPatient.study_id,
      uid: watermelonDBPatient.uid,
      updatedAt: watermelonDBPatient.updatedAt.getTime(),
    }

    return {
      ...patient,
      patientValues: patientValues,
      medicalCases: medicalCases,
    }
  }

  const _buildPatientValue = watermelonDBPatientValues => {
    return {
      patient_id: watermelonDBPatientValues.patient_id,
      node_id: watermelonDBPatientValues.node_id,
      answer_id: watermelonDBPatientValues.answer_id,
      value: watermelonDBPatientValues.value,
      fail_safe: watermelonDBPatientValues.fail_safe,
    }
  }

  const _buildMedicalCaseLight = async watermelonDBMedicalCase => {
    const patient = await watermelonDBMedicalCase.patient.fetch()

    return {
      id: watermelonDBMedicalCase.id,
      advancement: {
        stage: watermelonDBMedicalCase.stage,
        step: watermelonDBMedicalCase.step,
      },
      json: null,
      fail_safe: watermelonDBMedicalCase.fail_safe,
      createdAt: watermelonDBMedicalCase.createdAt.getTime(),
      updatedAt: watermelonDBMedicalCase.updatedAt.getTime(),
      synchronizedAt: watermelonDBMedicalCase.synchronizedAt.getTime(),
      closedAt: watermelonDBMedicalCase.closedAt.getTime(),
      version_id: watermelonDBMedicalCase.version_id,
      patient: {
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        birth_date: patient.birth_date.getTime(),
      },
    }
  }

  const _buildMedicalCase = async (
    watermelonDBMedicalCase,
    addPatient = true,
  ) => {
    const parsedJson = JSON.parse(watermelonDBMedicalCase.json)

    const medicalCase = {
      id: watermelonDBMedicalCase.id,
      activities: [],
      comment: parsedJson.comment,
      consent: parsedJson.consent,
      diagnosis: parsedJson.diagnosis,
      nodes: parsedJson.nodes,
      json: null,
      json_version: watermelonDBMedicalCase.json_version,
      advancement: {
        stage: watermelonDBMedicalCase.stage,
        step: watermelonDBMedicalCase.step,
      },
      fail_safe: watermelonDBMedicalCase.fail_safe,
      synchronizedAt: watermelonDBMedicalCase.synchronizedAt.getTime(),
      createdAt: watermelonDBMedicalCase.createdAt.getTime(),
      updatedAt: watermelonDBMedicalCase.updatedAt.getTime(),
      closedAt: watermelonDBMedicalCase.closedAt.getTime(),
      appVersion: parsedJson.metadata?.appVersion,
      version_id: watermelonDBMedicalCase.version_id,
    }

    if (addPatient) {
      const patient = await watermelonDBMedicalCase.patient.fetch()
      medicalCase.patient = patient
    }

    return medicalCase
  }

  /**
   * Generate class
   * @param { array|object } data - Data retrieved from server
   * @param { string } model - Class name
   * @param { boolean } light - build light versions
   * @returns {Promise<[]|PatientModel|MedicalCaseModel>}
   * @private
   */
  const _initClasses = async (data, model, light = true) => {
    let object = []
    if (model === 'Patient') {
      if (data instanceof Array) {
        object = await Promise.all(
          data.map(async item => {
            return _buildPatient(item)
          }),
        )
      } else {
        return _buildPatient(data)
      }
    } else if (data instanceof Array) {
      object = await Promise.all(
        data.map(async item => {
          if (light) {
            return _buildMedicalCaseLight(item)
          }
          return _buildMedicalCase(item)
        }),
      )
    } else {
      return _buildMedicalCase(data)
    }
    return object
  }

  /**
   * Map model to Watermelon table
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { string } - watermelon table name
   * @private
   */
  const _mapModelToTable = model => {
    switch (model) {
      case 'Patient':
        return 'patients'
      case 'MedicalCase':
        return 'medical_cases'
      case 'PatientValue':
        return 'patient_values'
      case 'Activity':
        return 'activities'
      default:
        console.error("Watermelon table doesn't exist", model)
    }
  }

  return {
    findBy,
    insertActivities,
    lock,
    destroyPatient,
    getActivities,
    getMedicalCases,
    getAll,
    getConsentsFile,
    insertPatient,
    insertMedicalCase,
    insertPatientValues,
    unlock,
    updatePatientValues,
    update,
  }
}
