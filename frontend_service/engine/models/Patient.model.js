// @flow

import * as _ from 'lodash';
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
  }


  // Create patient and push it in local storage
  save = async (patient) => {
    let patients = await this.getPatients();

    // uniqueId incremented
    let maxId = _.maxBy(patients, 'id');
    if (patients.length === 0) {
      maxId = { id: 0 };
    }
    patient.id = maxId.id + 1;

    patients.push(patient);

    // Set in localstorage
    await setItem('patients', patients);
  };

  // Validate input
  validate = async (patient) => {
    let errors = {};

    if (patient.firstname.trim() === '') {
      errors.firstname = i18n.t('form:required');
    }

    if (patient.lastname.trim() === '') {
      errors.lastname = i18n.t('form:required');
    }

    if (patient.gender == null) {
      errors.gender = i18n.t('form:required');
    }

    if (patient.birthdate === '') {
      errors.birthdate = i18n.t('form:required');
    }

    return errors;
  };

  // Get all patients in store
  getPatients = async () => {
    return await getArray('patients');
  };

}
