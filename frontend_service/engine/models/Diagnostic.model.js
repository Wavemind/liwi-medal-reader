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
    const { id, final_diagnostics, label, differential, reference, instances, complaint_category } = props;

    this.id = id;
    this.final_diagnostics = final_diagnostics;
    this.complaint_category = complaint_category;
    this.label = label;
    this.differential = differential;
    this.reference = reference;
    this.instances = instances;
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

  isExcludedByComplaintCategory(nodes) {
    return nodes[this.complaint_category].answer === Number(Object.keys(nodes[this.complaint_category].answers)[1]);
  }

  /**
   * Generate instance of final diagnostic for current diagnostic
   */
  instanceFinalDiagnostic() {
    Object.keys(this.final_diagnostics).map((id) => {
      this.final_diagnostics[id] = new FinalDiagnosticModel({
        ...this.final_diagnostics[id],
      });
    });
  }
}
