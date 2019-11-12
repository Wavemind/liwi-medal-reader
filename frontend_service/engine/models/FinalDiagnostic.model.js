// @flow

import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import { calculateCondition } from '../../algorithm/algoConditionsHelpers';
import { store } from '../../store';

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
      cc,
    } = props;

    this.label = label;
    this.diagnostic_id = diagnostic_id;
    this.treatments = treatments;
    this.managements = managements;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.excluding_final_diagnostics = excluding_final_diagnostics;
    this.excluded_by_final_diagnostics = excluded_by_final_diagnostics;
    this.cc = cc;

    this.requirement = new RequirementNodeModel({ ...props });
  }

  /**
   * Calculate condition to display a final diagnostic
   * Verify if the final diagnostic excluded an another one
   */
  calculateCondition = () => {
    // If this FD can be excluded by other high-priority FD
    if (this.excluded_by_final_diagnostics !== null) {
      const state$ = store.getState();
      // If this other high-priority FD is true so this is always false
      if (
        calculateCondition(state$.nodes[this.excluded_by_final_diagnostics]) ===  true
      ) {
        return false;
      }
    }

    // TODO change the excluding final diagnostics (can have an impact on showed treatment and management... so useless for now)
    // eslint-disable-next-line no-empty
    if (this.excluding_final_diagnostics !== null) {
    }

    return calculateCondition(this);
  };
}
