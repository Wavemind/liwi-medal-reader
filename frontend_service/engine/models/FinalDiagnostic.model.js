// @flow

import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';

interface FinalDiagnosticInterface {}

export class FinalDiagnosticModel extends NodeModel
  implements FinalDiagnosticInterface {
  constructor(props) {
    super(props);

    const {
      label,
      diagnostic_id,
      treatments,
      managements,
      conditions,
      top_conditions,
      excluding_final_diagnostics = null,
      excluded_by_final_diagnostics = null,
    } = props;

    this.label = label;
    this.diagnostic_id = diagnostic_id;
    this.treatments = treatments;
    this.managements = managements;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.excluding_final_diagnostics = excluding_final_diagnostics;
    this.excluded_by_final_diagnostics = excluded_by_final_diagnostics;

    this.requirement = new RequirementNodeModel({ ...props });
  }
}
