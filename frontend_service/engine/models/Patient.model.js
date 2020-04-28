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
      otherFacilityData = null,
      identifier = null,
      reason = '',
    } = props;

    if (this.id === undefined && id === undefined) {
      this.id = uuidv4();
      this.medicalCases = medicalCases;
      this.main_data_patient_id = main_data_patient_id;
      this.uid = identifier.uid.toString();
      this.studyID = identifier.studyID.toString();
      this.groupID = identifier.groupID.toString();

      if (otherFacilityData !== null) {
        this.secondUid = otherFacilityData.uid.toString();
        this.secondStudyID = otherFacilityData.studyID.toString();
        this.secondGroupID = otherFacilityData.groupID.toString();
      } else {
        this.secondUid = null;
        this.secondStudyID = null;
        this.secondGroupID = null;
      }
    } else {
      this.id = id;
      this.medicalCases = [];
      props.medicalCases.forEach((medicalCase) => {
        this.medicalCases.push(new MedicalCaseModel(medicalCase));
      });
    }
    this.reason = reason;
    this.identifier = identifier;
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
      medicalCases: [{ ...medicalCase, patient_id: this.id, json: JSON.stringify(medicalCase) }]
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
   * Defines if the patient has at least one medical case on going
   * @returns Boolean
   */
  hasCaseInProgress = () => {
    this.medicalCases.map((medicalCase) => {
      if (medicalCase.status !== medicalCaseStatus.close) {
        return true;
      }
    });
    return false;
  };

  wasInOtherFacility = () => {
    return this.secondUid !== null;
  };
}

PatientModel.schema = {
  name: 'Patient',
  primaryKey: 'id',
  properties: {
    id: 'string',
    uid: 'string',
    studyID: 'string',
    groupID: 'string',
    secondUid: 'string?',
    secondStudyID: 'string?',
    secondGroupID: 'string?',
    reason: 'string',
    medicalCases: 'MedicalCase[]',
    main_data_patient_id: { type: 'int', optional: true },
  },
};
