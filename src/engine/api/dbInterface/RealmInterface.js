import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';

const Realm = require('realm');

export default class RealmInterface {
  /**
   * Generates and returns a realm database object
   * @returns { Realm } - A realm database object
   */
  realm = () => {
    return new Realm({
      schema: [PatientModel, MedicalCaseModel],
      deleteRealmIfMigrationNeeded: true,
    });
  };

  /**
   * Creates an entry of a specific model in the database
   * @param { string } - The model name of the data we want to retreive
   * @param { integer } - The value of the object
   */
  createObject = (model, obj) => {
    this.realm().write(() => {
      this.realm().create(model, obj);
    });
  };

  /**
   * Retruns the entry of a specific model with an id
   * @param { string } - The model name of the data we want to retreive
   * @param { integer } - The id of the object we want
   * @returns { Collection } - The wanted object
   */
  findById = (model, id) => {
    return this.realm().objects(model).filtered('id = $0', id)[0];
  };

  /**
   * Retruns all the entry on a specific model
   * @param { string } - The model name of the data we want to retreive
   * @returns { Collection } - A collection of all the data
   */
  getAll = (model) => {
    return this.realm().objects(model);
  };

  writeField = (model, id, field, value) => {
    const object = this.findById(model, id);
    return this.realm().write(() => {
      object[field] = value;
    });
  };

  writeArray = (model, id, field, value) => {
    const object = this.findById(model, id);
    return this.realm().write(() => {
      object[field].push(value);
    });
  };
}
