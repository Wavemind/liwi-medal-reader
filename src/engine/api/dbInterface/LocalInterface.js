import { appSchema, tableSchema, Database } from '@nozbe/watermelondb';

import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Patient } from '../../../../frontend_service/helpers/Patient.model';
import { PatientValue } from '../../../../frontend_service/helpers/PatientValue.model';
import { MedicalCase } from '../../../../frontend_service/helpers/MedicalCase.model';
import { Activity } from '../../../../frontend_service/helpers/Activity.model';
import { getItem } from '../LocalStorage';

const schema = appSchema({
  version: 1,
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
        // { name: 'node', type: 'number', isOptional: true },
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

const database =  new Database({
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
      default:
        console.warn('Watermelon table doesn\'t exist', model);
    }
  };

  /**
   * Finds a object based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - The wanted object
   */
  findBy = (model, value, field = 'id') => {};

  /**
   * Deletes a specific object from the DB
   * @param { object } object - the object to delete
   */
  delete = (object) => {};

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Used for pagination,tells what page to show
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  getAll = async (model, page = null, params) => {
    const collection = database.get(this._mapModelToTable(model));

    const result = await collection.query().fetch();
    return this._generateList(result, model, params.columns);
  };

  /**
   * Fetch patient with consent file
   * @param { integer } page
   * @param { array } columns - Columns to fetch values
   * @returns {Promise<*>}
   */
  getConsentsFile = async (page, columns) => {};

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = async (model, object) => {
    console.log("object", object);
    const session = await getItem('session');
    const collection = database.get(this._mapModelToTable(model));
    if (session.facility.architecture === 'client_server') object = { ...object, fail_safe: true };
    await database.action(async () => {
      const newRecord = await collection.create(record => {
        record.uid = "fsdfsd"
        record.study_id = "dsad"
        record.group_id = "dsad"
        record.fail_safe = true
      });
      console.log(newRecord);

    });

   // this._savePatientValue(model, object);
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
  push = async (model, id, field, value) => {};

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
  update = async (model, id, fields, updatePatientValue) => {};

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
  closedAndNotSynchronized = async () => {};

  /**
   * Returns the medical case
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   * @returns { MedicalCaseModel } returns the medical case
   * @private
   */
  _getMedicalCaseFromModel = (model, object) => {};

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
    return data.map((entry) => {
      if (model === 'Patient') {
        return {
          id: entry.id,
          updated_at: entry.updated_at,
          values: columns.map((nodeId) => entry.getLabelFromNode(nodeId, algorithm)),
        };
      }
      return {
        id: entry.id,
        status: entry.status,
        clinician: entry.clinician,
        mac_address: entry.mac_address,
        updated_at: entry.updated_at,
        values: columns.map((nodeId) => entry.getLabelFromNode(nodeId, algorithm)),
      };
    });
  };

  /**
   * Generate an object than contains all the data needed to display consent list
   * @param data
   * @param columns
   * @returns {Promise<*>}
   * @private
   */
  _generateConsentList = async (data, columns) => {};

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
   * Saves the patient values based on the activities on the object
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   * @private
   */
  _savePatientValue = (model, object) => {};
}
