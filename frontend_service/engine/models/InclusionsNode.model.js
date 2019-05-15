// @flow

import { NodeModel } from './Node.model';

interface InclusionsNodeInterface {
  dd: Array<Object>;
  ps: Array<Object>;
}

export class InclusionsNodeModel
  implements InclusionsNodeInterface {
  constructor(props) {

    const { dd = [], ps = [], medicalCase = {} } = props;

    this.dd = dd;
    this.ps = ps;

  }
}
