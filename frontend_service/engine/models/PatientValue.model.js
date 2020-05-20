// @flow

export class PatientValueModel {
  constructor(props) {
  }
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
