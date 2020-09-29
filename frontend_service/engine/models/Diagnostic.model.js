// @flow

import { InstanceModel } from './Instance.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface DiagnosticInterface {
  final_diagnostics: Object;
  id: number;
  label: string;
  instances: Object;
  type: string;
}

export class DiagnosticModel implements DiagnosticInterface {
  constructor(props) {
    const { id, final_diagnostics, label, instances, complaint_category } = props;

    this.id = id;
    this.final_diagnostics = final_diagnostics;
    this.complaint_category = complaint_category;
    this.label = label;
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

  /**
   * Tests if diagnostic is excluded by the complaint category
   * @param nodes - All nodes, it's passed because I don't have access to state in the model
   * @returns {boolean}
   */
  isExcludedByComplaintCategory(nodes) {
    return nodes[this.complaint_category].booleanValue() === false;
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
