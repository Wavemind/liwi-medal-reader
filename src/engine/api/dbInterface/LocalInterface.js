import { appSchema, tableSchema, Database, Q } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import uuid from 'react-native-uuid';
import * as _ from 'lodash';

import moment from 'moment';
import { Patient, PatientModel } from '../../../../frontend_service/helpers/Patient.model';
import { PatientValue } from '../../../../frontend_service/helpers/PatientValue.model';
import { MedicalCase, MedicalCaseModel } from '../../../../frontend_service/helpers/MedicalCase.model';
import { Activity } from '../../../../frontend_service/helpers/Activity.model';
import { getItem } from '../LocalStorage';
import { categories } from '../../../../frontend_service/constants';
import { elementPerPage } from '../../../utils/constants';

const schema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'medical_cases',
      columns: [
        { name: 'json', type: 'string', isOptional: true, isIndexed: true },
        { name: 'synchronized_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'patient_id', type: 'string' },
        { name: 'fail_safe', type: 'boolean', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'uid', type: 'string', isIndexed: true },
        { name: 'study_id', type: 'string' },
        { name: 'group_id', type: 'string' },
        { name: 'other_uid', type: 'string', isOptional: true },
        { name: 'other_study_id', type: 'string', isOptional: true },
        { name: 'other_group_id', type: 'string', isOptional: true },
        { name: 'reason', type: 'string', isOptional: true },
        { name: 'consent', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'patient_values',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'node_id', type: 'number' },
        { name: 'answer_id', type: 'number', isOptional: true },
        { name: 'value', type: 'string', isOptional: true },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'activities',
      columns: [
        { name: 'stage', type: 'string' },
        { name: 'clinician', type: 'string' },
        { name: 'nodes', type: 'string' },
        { name: 'mac_address', type: 'string' },
        { name: 'medical_case_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synchronized_at', type: 'number', isOptional: true },
        { name: 'fail_safe', type: 'boolean' },
      ],
    }),
  ],
});

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  synchronous: true, // synchronous mode only works on iOS. improves performance and reduces glitches in most cases, but also has some downsides - test with and without it
});

const database = new Database({
  adapter,
  modelClasses: [Patient, PatientValue, MedicalCase, Activity],
  actionsEnabled: true,
});

export default class LocalInterface {
  /**
   * Map model to Watermelon table
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { string } - watermelon table name
   * @private
   */
  _mapModelToTable = (model) => {
    switch (model) {
      case 'Patient':
        return 'patients';
      case 'MedicalCase':
        return 'medical_cases';
      case 'PatientValue':
        return 'patient_values';
      default:
        console.warn("Watermelon table doesn't exist", model);
    }
  };

  /**
   * Finds a object based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - The wanted object
   */
  findBy = async (model, value, field = 'id') => {
    const collection = database.get(this._mapModelToTable(model));
    const object = await collection.query(Q.where(field, value));

    return object[0] === undefined ? null : this._initClasses(object[0], model);
  };

  /**
   * Deletes a specific object from the DB
   * @param { object } object - the object to delete
   */
  delete = (object) => {
    object.destroyPermanently();
  };

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Used for pagination,tells what page to show
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  getAll = async (model, page = null, params) => {
    const collection = database.get(this._mapModelToTable(model));
    let result = await collection.query().fetch();
    const queries = [];

    if (page === null) {
      return result;
    }
    const filters = this._generateFilteredQuery(model, params.filters);

    if (params.query !== '' && model === 'Patient') queries.push(Q.on('patient_values', 'value', Q.like(`%${Q.sanitizeLikeString(params.query)}%`)));
    // if (filters !== '') result = await result.filtered(filters);

    queries.push(Q.experimentalSortBy('updated_at', Q.asc));
    queries.push(Q.experimentalSkip((page - 1) * elementPerPage));
    queries.push(Q.experimentalTake(elementPerPage * page));

    result = await collection.query(...queries);
    result = await this._initClasses(result, model);
    return this._generateList(result, model, params.columns);
  };

  /**
   * Fetch patient with consent file
   * @param { integer } page
   * @param { array } columns - Columns to fetch values
   * @returns {Promise<*>}
   */
  getConsentsFile = async (page, columns) => {
    const queries = [];
    const collection = database.get('patients');
    let result = await collection.query().fetch();

    if (page === null) {
      return result;
    }

    queries.push(Q.experimentalSortBy('updated_at', Q.asc));
    queries.push(Q.experimentalSkip((page - 1) * elementPerPage));
    queries.push(Q.experimentalTake(elementPerPage * page));

    result = await collection.query(...queries);
    result = await this._initClasses(result, 'Patient');

    return this._generateConsentList(result, columns);
  };

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = async (model, object) => {
    const session = await getItem('session');
    const collection = database.get(this._mapModelToTable(model));
    let patient = null;

    if (session.facility.architecture === 'client_server') object = { ...object, fail_safe: true };

    await database.action(async () => {
      patient = await collection.create((record) => {
        record._raw.id = object.id;
        record.uid = object.uid;
        record.study_id = object.study_id;
        record.group_id = object.group_id;
        record.other_uid = object.other_uid;
        record.other_study_id = object.other_study_id;
        record.other_group_id = object.other_group_id;
        record.reason = object.reason;
        record.consent = object.consent;
        record.fail_safe = object.fail_safe;
      });
    });

    const nestedCollection = database.get('medical_cases');

    // MedicalCase
    await database.action(async () => {
      await nestedCollection.create((nestedRecord) => {
        object.medicalCases.forEach((medicalCase) => {
          nestedRecord._raw.id = medicalCase.id;
          nestedRecord.json = medicalCase.json;
          nestedRecord.synchronized_at = medicalCase.synchronized_at;
          nestedRecord.status = medicalCase.status;
          nestedRecord.patient.set(patient);

          this._generateActivities(medicalCase.activities, medicalCase.id);
        });
      });
    });

    await this._savePatientValue(model, object);
  };

  /**
   * Blank method used in httpInterface
   */
  lockMedicalCase = () => {};

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @returns { Collection } - Updated object
   */
  push = async (model, id, field, value) => {
    const session = await getItem('session');
    const object = await this.findBy(model, id);

    if (session.facility.architecture === 'client_server') {
      value = { ...value, fail_safe: true };
    }
    if (field === 'medicalCases') {
      const collection = database.get('medical_cases');

      // MedicalCase
      await database.action(async () => {
        await collection.create((record) => {
          record._raw.id = value.id;
          record.json = value.json;
          record.synchronized_at = value.synchronized_at;
          record.status = value.status;
          record.patient_id = id;
          this._generateActivities(value.activities, value.id);
        });
      });

      this._savePatientValue(model, object);
    }
  };

  /**
   * Blank method used in httpInterface
   */
  unlockMedicalCase = () => {};

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @param { boolean } updatePatientValue - Flag that tells us if we need to update the patient values
   * @returns { Collection } - Updated object
   */
  update = async (model, id, fields, updatePatientValue) => {
    const session = await getItem('session');
    const collection = database.get(this._mapModelToTable(model));

    if (session.facility.architecture === 'client_server') {
      fields = { ...fields, fail_safe: true };
    }

    const object = await collection.find(id);

    await database.action(async () => {
      Object.keys(fields).forEach((field) => {
        object.update((record) => {
          switch (field) {
            case 'patient':
              break;
            default:
              record[field] = fields[field];
          }
        });
      });
    });

    // Update patient updated_at value
    if (model === 'MedicalCase') {
      await database.action(async () => {
        const patientCollection = database.get('patients');
        const patient = await patientCollection.find(object.patient_id);
        await patient.update((record) => (record.updated_at = moment().toDate()));
      });
    }

    if (updatePatientValue && !Object.keys(fields).includes('patientValues') && ['Patient', 'MedicalCase'].includes(model)) {
      this._savePatientValue(model, object);
    }
  };

  /**
   * Finds a collection of objects based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - A collection of wanted values
   */
  where = async (model, value, field) => {};

  /**
   * Get all closed and not synchronized case
   * @returns {Promise<Realm.Results<Realm.Object>>}
   */
  closedAndNotSynchronized = async () => {
    const collection = database.get('medical_cases');

    return collection.query(Q.where('status', 'close'), Q.where('synchronized_at', null)).fetch();
  };

  /**
   * Returns the medical case
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   * @returns { MedicalCaseModel } returns the medical case
   * @private
   */
  _getMedicalCaseFromModel = async (model, object) => {
    switch (model) {
      case 'MedicalCase':
        return object;
      case 'Patient':
        const medicalCases = await object.medicalCases;
        return this._initClasses(medicalCases[medicalCases.length - 1], 'MedicalCase');
      default:
        console.error('Wrong model :', model, object);
    }
  };

  /**
   * Generate an object than contains all the data needed to display a model in a list
   * @param data : an array of of the model we want to display
   * @param model : name of the model we wanna display
   * @param columns : array of node id for getting value
   * @returns { Array[Object] } : The array used to display values in the list
   * @private
   */
  _generateList = async (data, model, columns) => {
    const algorithm = await getItem('algorithm');
    return Promise.all(
      data.map(async (entry) => {
        if (model === 'Patient') {
          const values = await Promise.all(columns.map((nodeId) => entry.getLabelFromNode(nodeId, algorithm)));
          return {
            id: entry.id,
            updated_at: entry.updated_at,
            values,
          };
        }
        const values = await Promise.all(columns.map((nodeId) => entry.getLabelFromNode(nodeId, algorithm)));
        return {
          id: entry.id,
          status: entry.status,
          clinician: entry.clinician,
          mac_address: entry.mac_address,
          updated_at: entry.updated_at,
          values,
        };
      })
    );
  };

  /**
   * Generate an object than contains all the data needed to display consent list
   * @param data
   * @param columns
   * @returns {Promise<*>}
   * @private
   */
  _generateConsentList = async (data, columns) => {
    const algorithm = await getItem('algorithm');
    return Promise.all(
      data.map(async (entry) => {
        const values = await Promise.all(columns.map((nodeId) => entry.getLabelFromNode(nodeId, algorithm)));
        return {
          id: entry.id,
          consent_file: entry.consent_file,
          values,
        };
      })
    );
  };

  /**
   * Generate query with filters
   * @param {object} filters - Filter object with key and value
   * @returns {string}
   * @private
   */
  _generateFilteredQuery = (model, filters) => {
    let query = '';

    if (!_.isEmpty(filters)) {
      Object.keys(filters).forEach((nodeId, key) => {
        filters[nodeId].map((filter, filterKey) => {
          query += model === 'MedicalCase' ? `status == "${filter}"` : `(patientValues.node_id == ${nodeId} AND patientValues.answer_id == ${filter})`;
          if (filterKey + 1 < filters[nodeId].length) {
            query += ' OR ';
          }
        });
        if (key + 1 < Object.keys(filters).length) {
          query += ' AND ';
        }
      });
    }

    return query;
  };

  /**
   * Generate class
   * @param { array|object } data - Data retrieved from server
   * @param { string } model - Class name
   * @returns {Promise<[]|PatientModel|MedicalCaseModel>}
   * @private
   */
  _initClasses = async (data, model) => {
    const object = [];
    const environment = await getItem('environment');

    if (model === 'Patient') {
      if (data instanceof Array) {
        data.forEach((item) => {
          object.push(new PatientModel(item, environment));
        });
      } else {
        return new PatientModel(data, environment);
      }
    } else if (data instanceof Array) {
      data.forEach((item) => {
        object.push(new MedicalCaseModel(item));
      });
    } else {
      return new MedicalCaseModel(data);
    }
    return Promise.all(object);
  };

  /**
   * Create activities for a releated medical case
   * @param { array } activities - List of activities to create
   * @param { integer } medicalCaseId
   * @private
   */
  _generateActivities = (activities, medicalCaseId) => {
    activities.forEach((activity) => {
      database.get('activities').create((record) => {
        record._raw.id = activity.id;
        record.stage = activity.stage;
        record.clinician = activity.clinician;
        record.nodes = activity.nodes;
        record.mac_address = activity.mac_address;
        record.medical_case_id = medicalCaseId;
        record.fail_safe = activity.fail_safe;
      });
    });
  };

  /**
   * Saves the patient values based on the activities on the object
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   * @private
   */
  _savePatientValue = async (model, object) => {
    const medicalCase = await this._getMedicalCaseFromModel(model, object);
    // Will update the patient values based on activities so we only take the edits
    const activities = await medicalCase.activities;
    const nodeActivities = JSON.parse(activities[activities.length - 1].nodes);
    const patient = await this.findBy('Patient', medicalCase.patient_id);

    nodeActivities.map(async (node) => {
      if ([categories.demographic, categories.basicDemographic].includes(medicalCase.nodes[node.id].category)) {
        const patientValues = await patient.patientValues;
        const patientValue = patientValues.find((patientValue) => patientValue.node_id === parseInt(node.id));
        // If the values doesn't exist we create it otherwise we edit it
        if (patientValue === undefined) {
          const collection = database.get('patient_values');

          await database.action(async () => {
            await collection.create((record) => {
              record._raw.id = uuid.v4();
              record.value = node.value;
              record.node_id = parseInt(node.id);
              record.answer_id = node.answer === null ? null : parseInt(node.answer);
              record.patient_id = medicalCase.patient_id;
            });
          });
        } else {
          await this.update('PatientValue', patientValue.id, {
            value: String(node.value),
            answer_id: node.answer === null ? null : parseInt(node.answer),
          });
        }
      }
    });
  };
}
