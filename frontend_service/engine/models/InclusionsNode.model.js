// @flow

 interface InclusionsNodeInterface {
  dd: Array<Object>;
  ps: Array<Object>;
}

export class InclusionsNodeModel implements InclusionsNodeInterface {
  constructor(props) {
    const {
      dd = [],
      ps = [],

    } = props;
    this.dd = dd;
    this.ps = ps;
  }
}
