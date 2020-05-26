// @flow

import uuid from 'react-native-uuid';
import moment from 'moment';
import I18n from '../../../src/utils/i18n';
import Database from '../../../src/engine/api/Database';
import { MedicalCaseModel } from './MedicalCase.model';
import { PatientValueModel } from './PatientValue.model';
import { getItem } from '../../../src/engine/api/LocalStorage';
import { displayFormats } from '../../constants';

export class PatientModel {
  constructor(props = {}) {
    const { id, medicalCases = [], main_data_patient_id = null, otherFacility = null, facility = null, reason = '', patientValues = null } = props;
    if (this.id === undefined || this.id === null) {
      if (otherFacility !== null) {
        this.other_uid = otherFacility?.uid?.toString();
        this.other_study_id = otherFacility?.study_id?.toString();
        this.other_group_id = otherFacility?.group_id?.toString();
      } else {
        this.other_uid = null;
        this.other_study_id = null;
        this.other_group_id = null;
      }
      this.updated_at = moment().toDate();
      this.main_data_patient_id = main_data_patient_id;
      this.patientValues = patientValues?.map((patientValue => new PatientValueModel(patientValue)));
      this.uid = facility !== null ? facility?.uid?.toString() : null;
      this.study_id = facility !== null ? facility?.study_id?.toString() : null;
      this.group_id = facility !== null ? facility?.group_id?.toString() : null;
      this.reason = reason;

      this.medicalCases = medicalCases;
      this.fail_safe = false;

      if (id !== undefined) {
        this.id = id;
        this.medicalCases = medicalCases.map((medicalCase) => new MedicalCaseModel(medicalCase));
      } else {
        this.id = null;
      }
    }
  }

  /**
   * Push a medical case in a patient
   * @param { object } medicalCase
   * @returns {Promise<boolean>}
   */
  addMedicalCase = async (medicalCase) => {
    const user = await getItem('user');
    const medicalCaseClass = new MedicalCaseModel(medicalCase);
    const database = await new Database();
    const activity = await medicalCase.generateActivity('registration', user, medicalCase.nodes);
    medicalCaseClass.patient_id = this.id;
    medicalCaseClass.json = JSON.stringify(medicalCaseClass);
    await medicalCaseClass.handleFailSafe();
    medicalCaseClass.activities = [activity];
    await database.push('Patient', this.id, 'medicalCases', medicalCaseClass);
    await database.update('Patient', this.id, { updated_at: moment().toDate() });
    return true;
  };

  /**
   * Get value of patient value
   * @param {integer} nodeId - Node id to retrieved
   * @param {object} nodes - List of nodes in algorithm
   * @returns {string|date} - value to display
   */
  getLabelFromNode = (nodeId, nodes) => {
    let displayedValue = '';
    const currentPatientValue = this.patientValues.find((patientValue) => patientValue.node_id === nodeId);

    if (currentPatientValue !== undefined) {
      if (nodes[currentPatientValue.node_id].display_format === displayFormats.date) {
        displayedValue = moment(currentPatientValue.value).format(I18n.t('application:date_format'));
      } else {
        displayedValue = currentPatientValue.value;
      }
    }

    return displayedValue;
  };

  /**
   * Save patient in database
   * @returns {Promise<void|string|Array|v.Chain|v.ExplicitChain<string>>}
   */
  save = async () => {
    const medicalCase = this.medicalCases[this.medicalCases.length - 1];
    const user = await getItem('user');
    const database = await new Database();
    this.id = uuid.v4();

    const activity = await medicalCase.generateActivity('registration', user, medicalCase.nodes);

    return database.insert('Patient', {
      ...this,
      medicalCases: [{
        ...medicalCase,
        patient_id: this.id,
        json: JSON.stringify(medicalCase),
        activities: [activity]
      }]
    });
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
    other_group_id: 'string?',
    reason: 'string?',
    medicalCases: 'MedicalCase[]',
    patientValues: 'PatientValue[]',
    updated_at: 'date',
    fail_safe: { type: 'bool', default: false },
  }
};
