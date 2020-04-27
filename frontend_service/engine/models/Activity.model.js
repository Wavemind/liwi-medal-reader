// @flow

import { v4 as uuidv4 } from 'uuid';
import { getItem } from '../../../src/engine/api/LocalStorage';
import { getDeviceInformation } from '../../../src/engine/api/Device';

export class ActivityModel {
  constructor() {
    this.id = uuidv4();
  }

  constructorAsync = async (props) => {
    const { stage, nodes, user, medicalCaseId } = props;

    const session = await getItem('session');
    this.isConnected = await getItem('isConnected');
    const deviceInfo = await getDeviceInformation();
    this.timestamp = new Date();
    this.stage = stage;
    this.nodes = JSON.stringify(nodes);
    this.user = user.toString();
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
