// @flow

import { NodeModel } from './Node.model';
import { ConditionsNodeModel } from './ConditionsNode.model';

interface FinalDiagnostictInterface {}

export class FinalDiagnosticModel extends NodeModel
  implements FinalDiagnostictInterface {
  constructor(props) {
    super(props);

    const { name, disease_id, treatments, managements, conditions, top_conditions } = props;

    console.log(props);
    this.name = name;
    this.disease_id = disease_id;
    this.treatments = treatments;
    this.managements = managements;
    this.conditions = conditions;
    this.top_conditions = top_conditions;

    this.conditons = new ConditionsNodeModel({ ...props });
  }
}
