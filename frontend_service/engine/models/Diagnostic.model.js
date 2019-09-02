// @flow

import { InstanceModel } from './Instance.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface DiagnosticInterface {
  final_diagnostics: Object;
  differential: Object;
  id: number;
  label: string;
  instances: Object;
  reference: string;
  type: string;
}

export class DiagnosticModel implements DiagnosticInterface {
  constructor(props) {
    const { id, final_diagnostics, label, differential, reference, instances, chief_complaint_id } = props;

    this.id = id;
    this.final_diagnostics = final_diagnostics;
    this.label = label;
    this.differential = differential;
    this.reference = reference;
    this.instances = instances;
    this.chief_complaint_id = chief_complaint_id;
    this.type = 'diagnostic';

    this.instanceLink();
    this.instanceFinalDiagnostic();
  }

  /**
   * Generate instance for current diagnostic
   */
  instanceLink() {
    Object.keys(this.instances).map((id) => {
      this.instances[id] = new InstanceModel({ ...this.instances[id] });
    });
  }

  /**
   * Generate instance of final diagnostic for current diagnostic
   */
  instanceFinalDiagnostic() {
    Object.keys(this.final_diagnostics).map((id) => {
      this.final_diagnostics[id] = new FinalDiagnosticModel({ ...this.final_diagnostics[id] });
    });
  }
}
