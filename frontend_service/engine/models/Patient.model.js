// @flow

import * as _ from 'lodash';
import moment from 'moment';
import { getArray, setItem } from '../../../src/engine/api/LocalStorage';
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
    this.create(props)
  }

  // Generate default patient value
  create = ( props = {} ) => {

    const {
      firstname = 'Ta où les vaches',
      lastname = 'Crozin ',
      birthdate = moment('1970-01-01T00:00:00.000').format(),
      gender = 'male',
      medicalCases = [],
    } = props;

    this.firstname = firstname;
    this.lastname = lastname;
    this.birthdate = birthdate;
    this.gender = gender;
    this.medicalCases = medicalCases;
  };

  // Create patient and push it in local storage
  save = async () => {
    let patients = await this.getPatients();

    // uniqueId incremented
    let maxId = _.maxBy(patients, 'id');
    if (patients.length === 0) {
      maxId = { id: 0 };
    }
    this.id = maxId.id + 1;

    patients.push(this);

    // Set in localstorage
    await setItem('patients', patients);
  };

  // Validate input
  validate = async () => {
    let errors = {};

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
