// @flow

import * as _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { getArray, setItemFromArray } from '../../../src/engine/api/LocalStorage';
import { MedicalCaseModel } from './MedicalCase.model';
import i18n from '../../../src/utils/i18n';
import { createObject } from '../../../src/engine/api/databaseStorage';


interface PatientModelInterface {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  gender: string;
  medicalCases: [MedicalCaseModel];
}

export class PatientModel implements PatientModelInterface {
  constructor(props = {}) {
    this.create(props);
  }

  // Generate default patient value
  create = async (props = {}) => {
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
  };

  // Create patient and push it in local storage
  save = async () => {
    const flatten = { ...this };

    const medicalCase = this.medicalCases[this.medicalCases.length - 1]

    createObject('Patient', {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      birthdate: this.birthdate,
      gender: this.gender,
      medicalCases: [{ id: uuidv4(), created_at: 'string', json: JSON.stringify(medicalCase) }],
      main_data_patient_id: this.main_data_patient_id,
    });

    await setItemFromArray('patients', flatten, flatten.id);
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

  // Get all patients in store
  getPatients = async () => {
    return await getArray('patients');
  };

  /**
  * Defines if the patient has at least one medical case on going
  * @returns Boolean
  */
  hasCaseInProgress = () => {
    this.medicalCases.map((medicalCase) => {
      if (medicalCase.status !== medicalCaseStatus.close)
        return true;
    });
    return false;
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

