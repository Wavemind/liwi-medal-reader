// @flow

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import find from 'lodash/find';

import { MedicalCaseModel } from './MedicalCase.model';
import i18n from '../../../src/utils/i18n';
import Database from '../../../src/engine/api/Database';

export class PatientModel {
  constructor(props = {}) {
    const {
      firstname = __DEV__ ? 'John' : '',
      lastname = __DEV__ ? 'Doe' : '',
      birthdate = moment('1970-01-01T00:00:00.000').format(),
      gender = __DEV__ ? 'male' : '',
      medicalCases = [],
      main_data_patient_id = null,
    } = props;

    if (this.id === undefined) {
      this.id = uuidv4();
      this.firstname = firstname;
      this.lastname = lastname;
      this.birthdate = birthdate;
      this.gender = gender;
      this.medicalCases = medicalCases;
      this.main_data_patient_id = main_data_patient_id;
    }
  }

  // Create patient and push it in local storage
  save = async () => {
    const medicalCase = this.medicalCases[this.medicalCases.length - 1];
    const database = await new Database();
    return database.insert('Patient', {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      birthdate: this.birthdate,
      gender: this.gender,
      medicalCases: [{ ...medicalCase, patient_id: this.id, json: JSON.stringify(medicalCase) }],
      main_data_patient_id: this.main_data_patient_id,
    });
  };

  addMedicalCase = async (medicalCase) => {
    medicalCase.patient_id = this.id;
    medicalCase.json = JSON.stringify(medicalCase);
    const database = await new Database();
    await database.push('Patient', this.id, 'medicalCases', medicalCase);
    return true;
  };

  // Validate input
  validate = () => {
    const errors = {};

    if (this.firstname.trim() === '') {
      errors.firstname = i18n.t('form:required');
    }

    if (this.lastname.trim() === '') {
      errors.lastname = i18n.t('form:required');
    }

    if (this.gender === '') {
      errors.gender = i18n.t('form:required');
    }

    if (this.birthdate === '') {
      errors.birthdate = i18n.t('form:required');
    }

    return errors;
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

  /**
   * @return string: return the full name patient
   */
  fullName = () => {
    return `${this.firstname} ${this.lastname}`;
  };

  /**
   * @return string: return the birthdate for the patient
   */
  printBirthdate = () => {
    // Filter medicalCase with date not null
    const medicalCaseWithBirthDate = this.medicalCases.filter((e) => {
      const date = find(e.nodes, { reference: 1, category: 'demographic', stage: 'registration' });
      if (date !== undefined) {
        return date.value !== null;
      }
    });

    // Sort medical cases by updated_at for get the last
    const medicalCase = medicalCaseWithBirthDate.sort((a, b) => {
      const dateA = moment(a.updated_at);
      const dateB = moment(b.updated_at);
      return dateB.diff(dateA);
    })[0];

    // Medical case match
    if (medicalCase) {
      // Parse date
      return moment(
        find(medicalCase.nodes, {
          reference: 1,
          category: 'demographic',
          stage: 'registration',
        }).value
      ).format('ll');
    }
    return i18n.t('patient:age_not_defined');
  };
}

PatientModel.schema = {
  name: 'Patient',
  primaryKey: 'id',
  properties: {
    id: 'string',
    firstname: 'string',
    lastname: 'string',
    birthdate: 'date',
    gender: 'string',
    medicalCases: 'MedicalCase[]',
    main_data_patient_id: { type: 'int', optional: true },
  },
};
