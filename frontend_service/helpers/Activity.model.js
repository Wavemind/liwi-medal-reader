// @flow

import uuid from 'react-native-uuid';
import moment from 'moment';
import { date, field, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Model } from '@nozbe/watermelondb';

import { getItem } from '../../src/engine/api/LocalStorage';
import { getDeviceInformation } from '../../src/engine/api/Device';

export class ActivityModel {
  constructor(props) {
    if (this.id === undefined) {
      return (async () => {
        const { stage, nodes, clinician, medical_case_id } = props;
        const session = await getItem('session');
        const deviceInfo = await getDeviceInformation();

        this.id = uuid.v4();
        this.stage = stage;
        this.nodes = JSON.stringify(nodes, (key, value) => (typeof value === 'undefined' ? null : value));
        this.clinician = clinician;
        this.medical_case_id = medical_case_id?.toString();
        this.mode = session.facility.architecture;
        this.mac_address = deviceInfo.mac_address;
        this.created_at = moment().toDate();
        this.synchronized_at = null;
        this.fail_safe = false;
        return this;
      })();
    }
  }
}

export class Activity extends Model {
  static table = 'activities';

  static associations = {
    medicalCases: { type: 'belongs_to', key: 'medical_case_id' },
  };

  @field('stage') stage;
  @field('clinician') clinician;
  @field('nodes') nodes;
  @field('mac_address') mac_address;
  @field('medical_case_id') medical_case_id;
  @date('synchronized_at') synchronized_at;
  @field('fail_safe') fail_safe;

  @date('created_at') created_at;

  @relation('medical_cases', 'medical_case_id') medicalCase;
}
