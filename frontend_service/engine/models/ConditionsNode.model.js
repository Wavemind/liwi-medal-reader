// @flow

import { NodeModel } from './Node.model';


interface InclusionsNodeInterface {
  dd: Array<Object>;
  ps: Array<Object>;
}

export class InclusionsNodeModel extends NodeModel implements InclusionsNodeInterface {
  constructor(props) {
    super(props);

    const {
      dd = [],
      ps = [],

    } = props;
    this.dd = dd;
    this.ps = ps;
  }
}
