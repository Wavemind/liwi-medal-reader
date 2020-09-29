// @flow

import uuid from 'react-native-uuid';

import { differenceNodes } from '../../../src/utils/swissKnives';
import { store } from '../../store';

export class PatientValueModel {
  constructor(props) {
    if (props !== undefined) {
      const { id, patient_id, node_id, answer_id, value, fail_safe = false } = props;
      this.id = id;
      this.patient_id = patient_id;
      this.node_id = node_id;
      this.answer_id = answer_id;
      this.value = value;
      this.fail_safe = fail_safe;
    }
  }

  /**
   * Compare store and patient value in patient
   * @param {Object} patient
   * @returns patient value updated
   */
  static getUpdatedPatientValue = (patient) => {
    const state = store.getState();

    const diffPatientValues = differenceNodes(state.patientValues, patient.patientValues, 'answer_id', 'node_id');

    const newPatientValues = state.patientValues.map((patientValue) => {
      const diffPatientValue = diffPatientValues.find((dpv) => dpv.node_id === patientValue.node_id);
      if (diffPatientValue !== undefined) {
        const newPatientValue = patient.patientValues.find((pv) => pv.node_id === diffPatientValues.node_id);
        const id = newPatientValue === undefined ? uuid.v4() : newPatientValue.id;
        return {
          ...diffPatientValue,
          patient_id: patient.id,
          id,
        };
      } else {
        return patientValue;
      }
    });

    return newPatientValues.filter((newPatientValue) => newPatientValue.id !== undefined);
  };
}

PatientValueModel.schema = {
  name: 'PatientValue',
  primaryKey: 'id',
  properties: {
    id: 'string',
    patient_id: 'string',
    node_id: 'int',
    answer_id: 'int?',
    value: 'string?',
    fail_safe: { type: 'bool', default: false },
  },
};
