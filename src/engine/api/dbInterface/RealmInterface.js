import uuid from 'react-native-uuid';

import { ActivityModel } from '../../../../frontend_service/engine/models/Activity.model';
import { PatientValueModel } from '../../../../frontend_service/engine/models/PatientValue.model';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { getItem } from '../LocalStorage';
import { elementPerPage } from '../../../utils/constants';
import { categories } from '../../../../frontend_service/constants';

const Realm = require('realm');

export default class RealmInterface {
  /**
   * Generates and returns a realm database object
   * @returns { Realm } - A realm database object
   * @private
   */
  _realm = () => {
    const key = new Int8Array(64); // populate with a secure key

    return new Realm({
      schema: [PatientValueModel, PatientModel, MedicalCaseModel, ActivityModel],
      deleteRealmIfMigrationNeeded: true,
      encryptionKey: key,
    });
  };

  /**
   * Finds a object based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - The wanted object
   */
  findBy = (model, value, field = 'id') => {
    const object = this._realm().objects(model).filtered(`${field} = $0`, value)[0];
    return object === undefined ? null : object;
  };

  /**
   * Deletes a specific object from the DB
   * @param { object } object - the object to delete
   */
  delete = (object) => {
    this._realm().write(() => {
      realm.delete(object);
    });
  };

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Used for pagination,tells what page to show
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  getAll = async (model, page = null, params) => {
    if (page === null) {
      return this._realm().objects(model);
    }
    let result = await this._realm().objects(model);
    const filters = this._generateFilteredQuery(params.filters);

    if (params.query !== '' && model === 'Patient') result = await result.filtered(`patientValues.value LIKE "*${params.query}*"`);
    if (filters !== '') result = await result.filtered(filters);

    return result
      .sorted('updated_at', 'ASC')
      .slice((page - 1) * elementPerPage, elementPerPage * page);
  };

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = async (model, object) => {
    const session = await getItem('session');
    if (session.group.architecture === 'client_server') object = { ...object, fail_safe: true };

    this._realm().write(() => {
      this._realm().create(model, object);
    });

   this._savePatientValue(model, object);
  };

  lockMedicalCase = () => {
  };

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

    if (session.group.architecture === 'client_server') {
      value = { ...value, fail_safe: true };
    }
    this._realm().write(() => {
      object[field].push(value);
    });
    if (field === 'medicalCases') this._savePatientValue(model, object);
  };

  /**
   * Blank method used in httpInterface
   */
  unlockMedicalCase = () => {
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @returns { Collection } - Updated object
   */
  update = async (model, id, fields) => {
    const session = await getItem('session');
    if (session.group.architecture === 'client_server') {
      fields = { ...fields, fail_safe: true };
    }

    this._realm().write(() => {
      this._realm().create(model, { id, ...fields }, 'modified');
    });
    const object = this.findBy(model, id);
    if (!Object.keys(fields).includes('patientValues') && ['Patient', 'MedicalCase'].includes(model)) {
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
  where = async (model, value, field) => {
    return this._realm().objects(model).filtered(`${field} = $0`, value);
  };

  /**
   * Returns the medical case
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   * @returns { MedicalCaseModel } returns the medical case
   * @private
   */
  _getMedicalCaseFromModel = (model, object) => {
    switch (model) {
      case 'MedicalCase':
        return object;
      case 'Patient':
        return object.medicalCases[object.medicalCases.length - 1];
      default:
        console.error('Wrong model :', model, object);
    }
  };

  /**
   * Generate query with filters
   * @param {object} filters - Filter object with key and value
   * @returns {string}
   * @private
   */
  _generateFilteredQuery = (filters) => {
    let query = '';
    if (filters !== null) {
      filters.forEach((filter, key) => {
        query += `${filter.key} == ${filter.value}`;
        if (key + 1 < filters.length) {
          query += ' OR ';
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
  _savePatientValue = (model, object) => {
    const medicalCase = this._getMedicalCaseFromModel(model, object);
    // Will update the patient values based on activities so we only take the edits
    const nodeActivities = JSON.parse(medicalCase.activities[medicalCase.activities.length - 1].nodes);
    const patient = this.findBy('Patient', medicalCase.patient_id);

    nodeActivities.map((node) => {
      if ([categories.demographic, categories.basicDemographic].includes(medicalCase.nodes[node.id].category)) {
        const patientValue = patient.patientValues.find((patientValue) => patientValue.node_id === parseInt(node.id));
        // If the values doesn't exist we create it otherwise we edit it
        if (patientValue === undefined) {
          this.push('Patient', medicalCase.patient_id, 'patientValues', {
            id: uuid.v4(),
            value: node.value,
            node_id: parseInt(node.id),
            answer_id: node.answer === null ? null : parseInt(node.answer),
            patient_id: medicalCase.patient_id,
          });
        } else {
          this._realm().write(() => {
            this.update('PatientValue', patientValue.id, { value: node.value, answer_id: parseInt(node.answer) });
          });
        }
      }
    });
  };
}
