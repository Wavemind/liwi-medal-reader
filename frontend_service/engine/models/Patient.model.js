// @flow

import * as _ from 'lodash';
import moment from 'moment';
import { getArray, setItemFromArray } from '../../../src/engine/api/LocalStorage';
import { MedicalCaseModel } from './MedicalCase.model';
import i18n from '../../../src/utils/i18n';

interface PatientModelInterface {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  gender: string;
  medicalCases: [MedicalCaseModel];
}

export class PatientModel implements PatientModelInterface {
  constructor(props) {
    this.create(props);
  }

  // Generate default patient value
  create = (props = {}) => {
    const {
      id = null,
      firstname = __DEV__ ? 'John' : '',
      lastname = __DEV__ ? 'Doe' : '',
      birthdate = moment('1970-01-01T00:00:00.000').format(),
      gender = __DEV__ ? 'male' : '',
      medicalCases = [],
      main_data_patient_id = null,
    } = props;

    this.firstname = firstname;
    this.lastname = lastname;
    this.birthdate = birthdate;
    this.gender = gender;
    this.medicalCases = medicalCases;
    this.main_data_patient_id = main_data_patient_id;

    if (id === null) {
      this.setId();
    } else {
      this.id = id;
    }
  };

  // uniqueId incremented
  setId = async () => {
    const patients = await this.getPatients();

    let maxId = _.maxBy(patients, 'id');
    if (patients.length === 0) {
      maxId = { id: 0 };
    }
    this.id = maxId.id + 1;
  };

  // Create patient and push it in local storage
  save = async () => {
    const flatten = { ...this };
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
}

PatientModel.schema = {
  name: 'PatientModel',
  properties: {
    firstName: 'string',
    lastName: 'string',
  },
};
