// @flow

import { v4 as uuidv4 } from 'uuid';
import Database from '../../../src/engine/api/Database';
import { MedicalCaseModel } from './MedicalCase.model';

export class PatientModel {
  constructor(props = {}) {
    const { id, medicalCases = [], main_data_patient_id = null, otherFacility = null, facility = null, reason = '' } = props;

    if (this.id === undefined) {
      if (otherFacility !== null) {
        this.other_uid = otherFacility?.uid?.toString();
        this.other_study_id = otherFacility?.study_id?.toString();
        this.other_group_iId = otherFacility?.group_id?.toString();
      } else {
        this.other_uid = null;
        this.other_study_id = null;
        this.other_group_iId = null;
      }

      this.main_data_patient_id = main_data_patient_id;

      this.uid = facility !== null ? facility?.uid?.toString() : null;
      this.study_id = facility !== null ? facility?.study_id?.toString() : null;
      this.group_id = facility !== null ? facility?.group_id?.toString() : null;
      this.reason = reason;

      this.medicalCases = medicalCases;

      if (id !== undefined) {
        this.id = id;
        this.medicalCases = [];
        medicalCases.forEach((medicalCase) => {
          this.medicalCases.push(new MedicalCaseModel(medicalCase));
        });
      } else {
        this.id = null;
      }
    }
  }

  /**
   * Save patient in database
   * @returns {Promise<void|string|Array|v.Chain|v.ExplicitChain<string>>}
   */
  save = async () => {
    const medicalCase = this.medicalCases[this.medicalCases.length - 1];
    const database = await new Database();
    this.json = JSON.stringify;
    this.id = uuidv4();
    return database.insert('Patient', {
      ...this,
      medicalCases: [{ ...medicalCase, patient_id: this.id, json: JSON.stringify(medicalCase) }],
    });
  };

  /**
   * Push a medical case in a patient
   * @param { object } medicalCase
   * @returns {Promise<boolean>}
   */
  addMedicalCase = async (medicalCase) => {
    medicalCase.patient_id = this.id;
    medicalCase.json = JSON.stringify(medicalCase);
    const database = await new Database();
    await database.push('Patient', this.id, 'medicalCases', medicalCase);
    return true;
  };

  /**
   * Test if patient was already registered in an another facility
   * @returns {boolean}
   */
  wasInOtherFacility = () => {
    return this.other_uid !== null && this.other_uid !== undefined;
  };
}

PatientModel.schema = {
  name: 'Patient',
  primaryKey: 'id',
  properties: {
    id: 'string',
    uid: 'string',
    study_id: 'string',
    group_id: 'string',
    other_uid: 'string?',
    other_study_id: 'string?',
    other_group_iId: 'string?',
    reason: 'string',
    medicalCases: 'MedicalCase[]',
    main_data_patient_id: { type: 'int', optional: true },
  },
};
