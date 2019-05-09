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

    this.refToItem(medicalCase);
  }

  refToItem(medicalCase) {
    this.ps.map((ps) => {
      ps.node = medicalCase.nodes[ps.id];
    });

    this.dd.map((dd) => {
      dd.node = medicalCase.diseases[dd.id];
    });

  }
}
