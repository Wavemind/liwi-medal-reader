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
      disease_id,
      treatments,
      managements,
      conditions,
      top_conditions,
      excluding_diagnosis,
    } = props;

    this.name = name;
    this.disease_id = disease_id;
    this.treatments = treatments;
    this.managements = managements;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.excluding_diagnosis = excluding_diagnosis;

    this.requirement = new RequirementNodeModel({ ...props });
  }
}
