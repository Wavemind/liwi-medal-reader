// @flow

import { NodeModel } from './Node.model';

interface ConditionsNodeInterface {
  conditions: Array<Object>;
  top_conditions: Array<Object>;
}

export class ConditionsNodeModel implements ConditionsNodeInterface {
  constructor(props) {

    const { conditions = [], top_conditions = [], medicalCase = {} } = props;

    this.conditions = conditions;
    this.top_conditions = top_conditions;
  }
}
