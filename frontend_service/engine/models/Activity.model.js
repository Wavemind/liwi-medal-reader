// @flow

import { v4 as uuidv4 } from 'uuid';
import { getItem } from '../../../src/engine/api/LocalStorage';
import { getDeviceInformation } from '../../../src/engine/api/Device';

export class ActivityModel {
  constructor() {}

  constructorAsync = async (props) => {
    const { stage, nodes, user, medicalCaseId } = props;
    this.id = uuidv4();

    const session = await getItem('session');
    const deviceInfo = await getDeviceInformation();
    this.timestamp = new Date();
    this.stage = stage;
    this.nodes = JSON.stringify(nodes);
    this.user = user.toString();
    this.synchronized_at = null;
    this.medicalCaseId = medicalCaseId.toString();
    this.mode = session.group.architecture;
    this.groupId = session.group.id.toString();
    this.macAdresse = deviceInfo.mac_address;
  };
}

ActivityModel.schema = {
  name: 'Activity',
  primaryKey: 'id',
  properties: {
    id: 'string',
    synchronized_at: 'date?',
    timestamp: 'date',
    stage: 'string',
    user: 'string',
    nodes: 'string',
    mode: 'string',
    groupId: 'string',
    macAdresse: 'string',
    medicalCaseId: 'string?',
    patientId: 'string?',
  },
};
