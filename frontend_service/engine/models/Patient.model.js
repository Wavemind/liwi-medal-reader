// @flow

import { v4 as uuidv4 } from 'uuid';
import Database from '../../../src/engine/api/Database';
import { MedicalCaseModel } from './MedicalCase.model';

export class PatientModel {
  constructor(props = {}) {
    const {
      id,
      medicalCases = [],
      main_data_patient_id = null,
      otherFacility = null,
      facility = null,
      reason = '',
    } = props;

    if (otherFacility !== null) {
      this.otherUid = otherFacility?.uid?.toString();
      this.otherStudyId = otherFacility?.studyId?.toString();
      this.otherGroupId = otherFacility?.groupId?.toString();
    } else {
      this.otherUid = null;
      this.otherStudyId = null;
      this.otherGroupId = null;
    }

    this.main_data_patient_id = main_data_patient_id;

    this.uid = facility?.uid?.toString();
    this.studyId = facility?.studyId?.toString();
    this.groupId = facility?.groupId?.toString();
    this.reason = reason;

    this.medicalCases = medicalCases;

    if (this.id === undefined) {
      if (id !== undefined) {
        this.id = id;
        medicalCases.forEach((medicalCase) => {
          this.medicalCases.push(new MedicalCaseModel(medicalCase));
        });
      } else {
        this.id = uuidv4();
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

  wasInOtherFacility = () => {
    return this.otherUid !== null;
  };
}

PatientModel.schema = {
  name: 'Patient',
  primaryKey: 'id',
  properties: {
    id: 'string',
    uid: 'string',
    studyId: 'string',
    groupId: 'string',
    otherUid: 'string?',
    otherStudyId: 'string?',
    otherGroupId: 'string?',
    reason: 'string',
    medicalCases: 'MedicalCase[]',
    main_data_patient_id: { type: 'int', optional: true },
  },
};
