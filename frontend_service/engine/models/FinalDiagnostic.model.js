// @flow

import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';

interface FinalDiagnosticInterface {}

export class FinalDiagnosticModel extends NodeModel
  implements FinalDiagnosticInterface {
  constructor(props) {
    super(props);

    const {
      name,
      final_diagnostic_id,
      treatments,
      managements,
      conditions,
      top_conditions,
      excluding_final_diagnostic,
    } = props;

    this.name = name;
    this.final_diagnostic_id = final_diagnostic_id;
    this.treatments = treatments;
    this.managements = managements;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.excluding_final_diagnostic = excluding_final_diagnostic;

    this.requirement = new RequirementNodeModel({ ...props });
  }
}
