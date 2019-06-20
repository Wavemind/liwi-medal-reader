// @flow

interface InclusionsNodeInterface {
  dd: Array<Object>;
  ps: Array<Object>;
}

export class InclusionsNodeModel implements InclusionsNodeInterface {
  constructor(props) {
    const { dd = [], qs = [], medicalCase = {} } = props;
    this.dd = dd;
    this.qs = qs;
  }
}
