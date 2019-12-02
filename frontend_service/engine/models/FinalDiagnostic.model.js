// @flow

import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import { calculateCondition } from '../../algorithm/algoConditionsHelpers';
import { store } from '../../store';
import { nodesType } from '../../constants';
import { getStatusOfDD } from '../../algorithm/algoTreeDiagnosis';

interface FinalDiagnosticInterface {}

export class FinalDiagnosticModel extends NodeModel implements FinalDiagnosticInterface {
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
      instances = [],
    } = props;

    this.label = label;
    this.diagnostic_id = diagnostic_id;
    this.treatments = treatments;
    this.managements = managements;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.excluding_final_diagnostics = excluding_final_diagnostics;
    this.excluded_by_final_diagnostics = excluded_by_final_diagnostics;
    this.instances = instances;
    this.cc = cc;

    this.requirement = new RequirementNodeModel({ ...props });
  }

  /**
   * Calculate condition to display a final diagnostic
   * Verify if the final diagnostic excluded an another one
   */
  calculateCondition = () => {
    const state$ = store.getState();
    let conditioNValueTrue = [];
    // Generate only the top_condition with conditionValue to true => they are not disabled
    this.top_conditions.map((condition) => {
      let findDDinNode = state$.nodes[condition.first_node_id].dd.find((d) => d.id === this.diagnostic_id);
      if (findDDinNode.conditionValue === true) {
        conditioNValueTrue.push(condition);
      }
    });

    // Return the status of this dd
    let statusOfDD = getStatusOfDD(state$, this);

    // If this FD can be excluded by other high-priority FD
    if (this.excluded_by_final_diagnostics !== null) {
      // If this other high-priority FD is true so this is always false
      if (state$.nodes[this.excluded_by_final_diagnostics].calculateCondition() === true) {
        return false;
      }
    }

    // TODO change the excluding final diagnostics (can have an impact on showed treatment and management... so useless for now)
    // eslint-disable-next-line no-empty
    if (this.excluding_final_diagnostics !== null) {
    }
    if (statusOfDD === false) {
      return false;
    } else if (statusOfDD === null) {
      return null;
    } else if (statusOfDD === true) {
      let tempDd = { ...this, top_conditions: conditioNValueTrue };
      return calculateCondition(tempDd);
    }
  };

  /**
   * Returns all the FinalDiagnostics by their status (included | excluded | not_defined)
   *
   * @return {object} An hash with all the diagnostics with the following structure
   *  {
   *    included: [],
   *    excluded: [],
   *    not_defined: [],
   *  }
   *
   */
  static all() {
    const state$ = store.getState();
    const { nodes } = state$;

    let finalDiagnostics = nodes.filterByType(nodesType.finalDiagnostic);

    const finalDiagnosticsNull = [];
    const finalDiagnosticsTrue = [];
    const finalDiagnosticsFalse = [];

    for (let index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        let finalDiagnostic = finalDiagnostics[index];
        const chiefComplaint = nodes[finalDiagnostic.cc];

        let condition = finalDiagnostic.calculateCondition();

        if (chiefComplaint.answer === Number(Object.keys(chiefComplaint.answers)[1])) {
          finalDiagnosticsFalse.push({
            ...finalDiagnostic,
          });
          continue;
        }

        switch (condition) {
          case true:
            finalDiagnosticsTrue.push({
              ...finalDiagnostic,
            });

            break;
          case false:
            finalDiagnosticsFalse.push({
              ...finalDiagnostic,
            });
            break;
          case null:
            finalDiagnosticsNull.push({
              ...finalDiagnostic,
            });
            break;
        }
      }
    }

    return {
      included: finalDiagnosticsTrue,
      excluded: finalDiagnosticsFalse,
      not_defined: finalDiagnosticsNull,
    };
  }
}
