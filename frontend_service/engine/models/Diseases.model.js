// @flow

import { LinkNodeModel } from './Link.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface DiseasesInterface {
  diagnosis: Object;
  differential: Object;
  id: number;
  label: string;
  nodes: Object;
  reference: string;
}

export class DiseasesModel implements DiseasesInterface {
  constructor(props) {
    const { id, diagnosis, label, differential, reference, nodes } = props;

    this.id = id;
    this.diagnosis = diagnosis;
    this.label = label;
    this.differential = differential;
    this.reference = reference;
    this.nodes = nodes;

    this.instanceLink();
    this.instanceDiagnosis();
  }

  instanceLink() {
    Object.keys(this.nodes).map((id) => {
      this.nodes[id] = new LinkNodeModel({ ...this.nodes[id] });
    });
  }

  instanceDiagnosis() {
    Object.keys(this.diagnosis).map((id) => {
      this.diagnosis[id] = new FinalDiagnosticModel({ ...this.diagnosis[id] });
    });
  }
}
