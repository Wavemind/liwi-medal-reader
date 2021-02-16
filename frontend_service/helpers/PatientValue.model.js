// @flow

import uuid from 'react-native-uuid';
import { Model } from '@nozbe/watermelondb';
import { relation } from '@nozbe/watermelondb/decorators';

import { differenceNodes } from '../../src/utils/swissKnives';
import { store } from '../store';

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
      }
      return patientValue;
    });

    return newPatientValues.filter((newPatientValue) => newPatientValue.id !== undefined);
  };
}

export class PatientValue extends Model {
  static table = 'patient_values';

  static associations = {
    patients: { type: 'belongs_to', foreignKey: 'patient_id' },
  };

  @relation('patients', 'patient_id') patient;
}
