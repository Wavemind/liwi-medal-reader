// @flow

import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import { calculateCondition } from '../../algorithm/algoConditionsHelpers';
import { store } from '../../store';
import { nodesType } from '../../constants';
import { liwiColors } from '../../../src/utils/constants';

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
        calculateCondition(state$.nodes[this.excluded_by_final_diagnostics]) === true
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
        let type;
        let style = {};
        let name;

        if (chiefComplaint.answer === Number(Object.keys(chiefComplaint.answers)[1])) {
          type = 'Entypo';
          name = 'circle-with-cross';
          finalDiagnosticsFalse.push({
            ...finalDiagnostic,
            type,
            name,
            style,
          });
          continue;
        }

        switch (condition) {
          case true:
            type = 'AntDesign';
            name = 'checkcircle';
            style.color = liwiColors.greenColor;
            finalDiagnosticsTrue.push({
              ...finalDiagnostic,
              type,
              name,
              style,
            });

            break;
          case false:
            type = 'Entypo';
            name = 'circle-with-cross';
            style.color = liwiColors.redColor;
            finalDiagnosticsFalse.push({
              ...finalDiagnostic,
              type,
              name,
              style,
            });
            break;
          case null:
            type = 'AntDesign';
            name = 'minuscircleo';
            style.color = liwiColors.darkerGreyColor;
            finalDiagnosticsNull.push({
              ...finalDiagnostic,
              type,
              name,
              style,
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
