// @flow

import { LinkNodeModel } from './Link.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface DiagnosticInterface {
  finalDiagnostics: Object;
  differential: Object;
  id: number;
  label: string;
  nodes: Object;
  reference: string;
}

export class DiagnosticModel implements DiagnosticInterface {
  constructor(props) {
    const { id, final_diagnostics, label, differential, reference, nodes } = props;

    this.id = id;
    this.finalDiagnostics = final_diagnostics;
    this.label = label;
    this.differential = differential;
    this.reference = reference;
    this.nodes = nodes;

    this.instanceLink();
    this.instanceFinalDiagnostic();
  }

  instanceLink() {
    Object.keys(this.nodes).map((id) => {
      this.nodes[id] = new LinkNodeModel({ ...this.nodes[id] });
    });
  }

  instanceFinalDiagnostic() {
    Object.keys(this.finalDiagnostics).map((id) => {
      this.finalDiagnostics[id] = new FinalDiagnosticModel({ ...this.finalDiagnostics[id] });
    });
  }
}
