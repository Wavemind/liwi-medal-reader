import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';

const Realm = require('realm');

export default class RealmInterface {
  realm = () => {
    return new Realm({
      schema: [PatientModel, MedicalCaseModel],
      deleteRealmIfMigrationNeeded: true,
    });
  };

  createObject = (model, obj) => {
    this.realm().write(() => {
      this.realm().create(model, obj);
    });
  };

  findById = (model, id) => {
    return this.realm().objects(model).filtered('id = $0', id)[0];
  };

  getAll = (model) => {
    return this.realm().objects(model);
  };
}
