
import { PatientModel } from '../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../frontend_service/engine/models/MedicalCase.model';

const Realm = require('realm');

const realm = () => {
  return new Realm({
    schema: [PatientModel, MedicalCaseModel],
    deleteRealmIfMigrationNeeded: true,
  });
  ;
}

export const getAll = (model) => {
  return realm().objects(model);
};

export const createObject = (model, obj) => {
  realm().write(() => {
    realm().create(model, obj);
  });
};
