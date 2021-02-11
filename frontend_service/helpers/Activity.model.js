// @flow

import uuid from 'react-native-uuid';
import moment from 'moment';
import {Model} from '@nozbe/watermelondb';

import { getItem } from '../../src/engine/api/LocalStorage';
import { getDeviceInformation } from '../../src/engine/api/Device';

export class ActivityModel {
  constructor(props) {
    if (this.id === undefined) {
      return (async () => {
        const { stage, nodes, user, medical_case_id } = props;
        const session = await getItem('session');
        const deviceInfo = await getDeviceInformation();

        this.id = uuid.v4();
        this.stage = stage;
        this.nodes = JSON.stringify(nodes);
        this.clinician = user.first_name + " " + user.last_name;
        this.medical_case_id = medical_case_id?.toString();
        this.mode = session.facility.architecture;
        this.mac_address = deviceInfo.mac_address;
        this.created_at = moment().toDate();
        this.synchronized_at = null;
        this.fail_safe = false;
        return this;
      })();
    }
  };
}

export class Activity extends Model {
  static table = 'activities';

  static associations = {
    posts: { type: 'belongs_to', key: 'post_id' },
  }
}
