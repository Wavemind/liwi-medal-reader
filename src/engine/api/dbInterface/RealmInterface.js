import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';

const Realm = require('realm');

export default class RealmInterface {
  /**
   * Generates and returns a realm database object
   * @returns { Realm } - A realm database object
   */
  _realm = () => {
    return new Realm({
      schema: [PatientModel, MedicalCaseModel],
      deleteRealmIfMigrationNeeded: true,
    });
  };

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = (model, object) => {
    this._realm().write(() => {
      this._realm().create(model, object);
    });
  };

  /**
   * Returns the entry of a specific model with an id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The id of the object we want
   * @returns { Collection } - The wanted object
   */
  findById = (model, id) => {
    return this._realm().objects(model).filtered('id = $0', id)[0];
  };

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { Collection } - A collection of all the data
   */
  getAll = (model) => {
    return this._realm().objects(model);
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @returns { Collection } - Updated object
   */
  update = (model, id, fields) => {
    this._realm().write(() => {
      this._realm().create(model, { id, ...fields }, 'modified');
    });
  };

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @returns { Collection } - Updated object
   */
  push = (model, id, field, value) => {
    this._realm().write(() => {
      const object = this.findById(model, id);
      object[field].push(value);
    });
  };
}
