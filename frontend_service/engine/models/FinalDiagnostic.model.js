// @flow

import find from 'lodash/find';
import * as _ from 'lodash';
import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import {
  calculateCondition,
  comparingTopConditions,
  reduceConditionArrayBoolean,
} from '../../algorithm/algoConditionsHelpers';
import { store } from '../../store';
import { nodesType } from '../../constants';

interface FinalDiagnosticInterface {
}

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
   * 1. Check the current status of this instance
   * 2. Depending the result go recursive OR calculate final path DD
   *
   * @params state$: All the state of the reducer
   * @params instance: The instance currently working
   * @params dd: The Final Diagnostics we want to get the status
   *
   * @return boolean: return the status of the path
   *      true = can reach the end
   *      null = Still possible but not yet
   *      false = can't access the end anymore
   */
  recursiveNodeDd = (state$, instance, dd) => {
    /**
     * Initial Var
     */
    let currentNode = state$.nodes[instance.id];
    let instanceConditionValue = find(currentNode.dd, (p) => p.id === dd.diagnostic_id).conditionValue;

    /**
     * Get the condition of the instance link
     * Do not change to this.calculateCondtion -> infinite loop
     */
    let instanceCondition = calculateCondition(instance);

    // The condition path is not answered
    // Wait on user
    if (currentNode.answer === null && instanceCondition === true) {
      return null;
    }

    // The condition path is not respected so we cant go deeper
    if (instanceCondition === false && instanceConditionValue === false) {
      return false;
    }
    // The condition path is not answered
    // Wait on user
    if (instanceCondition === null) {
      return null;
    }
    // Remove path other dd
    let childrenWithoutOtherDd = instance.children.filter((id) => {
      if (state$.nodes[id].type === nodesType.finalDiagnostic && state$.nodes[id].id !== dd.id) {
        return false;
      }
      return true;
    });

    let recursif = childrenWithoutOtherDd.map((childId) => {
      let child = state$.nodes[childId];
      // If this is not the final DD we calculate the conditonValue of the child
      if (child.type === nodesType.question || child.type === nodesType.questionsSequence) {
        return this.recursiveNodeDd(state$, state$.diagnostics[dd.diagnostic_id].instances[child.id], dd);
      } else if (child.id === dd.id && child.type === nodesType.finalDiagnostic) {
        let top_conditions = _.filter(dd.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
        // We get the condition of the final link
        let arrayBoolean = top_conditions.map((condition) => {
          return comparingTopConditions(dd, condition);
        });
        // calcule final path
        let r = reduceConditionArrayBoolean(arrayBoolean);
        return r;
      }
    });

    return reduceConditionArrayBoolean(recursif);
  };

  /**
   * 1. Get top level node instance
   * 2.
   * 2. Depending the result go recursive OR calculate final path DD
   *
   * @params state$: All the state of the reducer
   * @params dd: The Final Diagnostics we want to get the status
   *
   * @return boolean: return the status of the DD
   *      true = can reach the end
   *      null = Still possible but not yet
   *      false = can't access the end anymore
   */
  getStatusOfDD = (state$, dd) => {
    let topLevelNodes = [];
    let instancesOfDiagnosticByDd = state$.diagnostics[dd.diagnostic_id].instances;
    // Set top Level Nodes
    Object.keys(instancesOfDiagnosticByDd).map((instanceId) => {
      // Is top level nodes
      const topLevelNode = instancesOfDiagnosticByDd[instanceId].top_conditions.length === 0;
      // Is not related top treatment or management
      const isNotRelatedToTreatmentManagement = instancesOfDiagnosticByDd[instanceId].final_diagnostic_id === null;
      if (topLevelNode && isNotRelatedToTreatmentManagement) {
        topLevelNodes.push(instancesOfDiagnosticByDd[instanceId]);
      }
    });

    let allNodesAnsweredInDd = topLevelNodes.map((topNode) => this.recursiveNodeDd(state$, topNode, dd));

    return reduceConditionArrayBoolean(allNodesAnsweredInDd);
  };

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
    let statusOfDD = this.getStatusOfDD(state$, this);

    // If this FD can be excluded by other high-priority FD
    if (this.excluded_by_final_diagnostics !== null) {
      let excludingNode = state$.nodes[this.excluded_by_final_diagnostics];
      do {
        // If this other high-priority FD is true so this is always false
        if (excludingNode.calculateCondition() === true) {
          return false;
        }
        excludingNode = state$.nodes[excludingNode.excluded_by_final_diagnostics];

      }
      while (excludingNode !== undefined);
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
        const complaintCategory = nodes[finalDiagnostic.cc];

        let condition = finalDiagnostic.calculateCondition();

        if (complaintCategory.answer === Number(Object.keys(complaintCategory.answers)[1])) {
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
