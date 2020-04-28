// @flow

import { v4 as uuidv4 } from 'uuid';
import Database from '../../../src/engine/api/Database';
import { MedicalCaseModel } from './MedicalCase.model';

export class PatientModel {
  constructor(props = {}) {
    const { id, medicalCases = [], main_data_patient_id = null } = props;

    if (this.id === undefined && id === undefined) {
      this.id = uuidv4();
      this.medicalCases = medicalCases;
      this.main_data_patient_id = main_data_patient_id;
    } else {
      this.id = props.id;
      this.medicalCases = [];
      props.medicalCases.forEach((medicalCase) => {
        this.medicalCases.push(new MedicalCaseModel(medicalCase));
      });
    }
  }

  /**
   * Save patient in database
   * @returns {Promise<void|string|Array|v.Chain|v.ExplicitChain<string>>}
   */
  save = async () => {
    const medicalCase = this.medicalCases[this.medicalCases.length - 1];
    const database = await new Database();
    return database.insert('Patient', {
      id: this.id,
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
}

PatientModel.schema = {
  name: 'Patient',
  primaryKey: 'id',
  properties: {
    id: 'string',
    medicalCases: 'MedicalCase[]',
    main_data_patient_id: { type: 'int', optional: true },
  },
};
