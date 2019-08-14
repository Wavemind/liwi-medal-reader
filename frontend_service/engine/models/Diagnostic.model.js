// @flow

import { LinkNodeModel } from './Link.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface DiagnosticInterface {
  final_diagnostics: Object;
  differential: Object;
  id: number;
  label: string;
  nodes: Object;
  reference: string;
  type: string;
}

export class DiagnosticModel implements DiagnosticInterface {
  constructor(props) {
    const { id, final_diagnostics, label, differential, reference, nodes } = props;

    this.id = id;
    this.final_diagnostics = final_diagnostics;
    this.label = label;
    this.differential = differential;
    this.reference = reference;
    this.nodes = nodes;
    this.type = 'diagnostic';

    this.instanceLink();
    this.instanceFinalDiagnostic();
  }

  instanceLink() {
    Object.keys(this.nodes).map((id) => {
      this.nodes[id] = new LinkNodeModel({ ...this.nodes[id] });
    });
  }

  instanceFinalDiagnostic() {
    Object.keys(this.final_diagnostics).map((id) => {
      this.final_diagnostics[id] = new FinalDiagnosticModel({ ...this.final_diagnostics[id] });
    });
  }
}
