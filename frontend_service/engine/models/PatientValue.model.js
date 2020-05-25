// @flow

export class PatientValueModel {
  constructor(props) {
    const { id, patient_id, node_id, answer_id, value, fail_safe } = props;
    this.id = id;
    this.patient_id = patient_id;
    this.node_id = node_id;
    this.answer_id = answer_id;
    this.value = value;
    this.fail_safe = fail_safe;
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
