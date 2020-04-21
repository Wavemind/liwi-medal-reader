
import { PatientModel } from '../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../frontend_service/engine/models/MedicalCase.model';

const Realm = require('realm');

/**
* Generates and returns a realm database object
* @returns { Realm } - A realm database object
*/
export const realm = () => {
  return new Realm({
    schema: [PatientModel, MedicalCaseModel],
    deleteRealmIfMigrationNeeded: true,
  });
  ;
}

/**
* Retruns all the entry on a specific model
* @param { string } - The model name of the data we want to retreive
* @returns { Collection } - A collection of all the data
*/
export const getAll = (model) => {
  return realm().objects(model);
};

/**
* Retruns the entry of a specific model with an id
* @param { string } - The model name of the data we want to retreive
* @param { integer } - The id of the object we want
* @returns { Collection } - The wanted object
*/
export const findById = (model, id) => {
  return realm().objects(model).filtered('id = $0', id)[0];
}

/**
* Creates an entry of a specific model in the database
* @param { string } - The model name of the data we want to retreive
* @param { integer } - The value of the object
*/
export const createObject = (model, obj) => {
  realm().write(() => {
    realm().create(model, obj);
  });
};
