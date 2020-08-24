// @flow

import find from 'lodash/find';
import * as _ from 'lodash';
import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import { calculateCondition, comparingTopConditions, reduceConditionArrayBoolean } from '../../algorithm/conditionsHelpers.algo';
import { store } from '../../store';
import { nodeTypes } from '../../constants';

interface FinalDiagnosticInterface {}

export class FinalDiagnosticModel extends NodeModel implements FinalDiagnosticInterface {
  constructor(props) {
    super(props);

    const { label, diagnostic_id, drugs, managements, conditions, top_conditions, excluding_final_diagnostics = [], excluded_final_diagnostics = [], cc, instances = [] } = props;

    this.label = label;
    this.diagnostic_id = diagnostic_id;
    this.drugs = drugs;
    this.managements = managements;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.excluding_final_diagnostics = excluding_final_diagnostics;
    this.excluded_final_diagnostics = excluded_final_diagnostics;
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
  recursiveNodeDd = (medicalCase, instance, dd) => {
    /**
     * Initial Var
     */
    const currentNode = medicalCase.nodes[instance.id];
    const instanceConditionValue = find(currentNode.dd, (p) => p.id === dd.diagnostic_id).conditionValue;

    /**
     * Get the condition of the instance link
     * Do not change to this.calculateCondition -> infinite loop
     */
    const instanceCondition = calculateCondition(instance);

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
    const childrenWithoutOtherDd = instance.children.filter((id) => {
      if (medicalCase.nodes[id].type === nodeTypes.finalDiagnostic && medicalCase.nodes[id].id !== dd.id) {
        return false;
      }
      return true;
    });

    const recursif = childrenWithoutOtherDd.map((childId) => {
      const child = medicalCase.nodes[childId];
      // If this is not the final DD we calculate the conditionValue of the child
      if (child.type === nodeTypes.question || child.type === nodeTypes.questionsSequence) {
        return this.recursiveNodeDd(medicalCase, medicalCase.diagnostics[dd.diagnostic_id].instances[child.id], dd);
      }
      if (child.id === dd.id && child.type === nodeTypes.finalDiagnostic) {
        const top_conditions = _.filter(dd.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
        // We get the condition of the final link
        const arrayBoolean = top_conditions.map((condition) => {
          return comparingTopConditions(dd, condition, medicalCase);
        });
        // calcule final path
        const r = reduceConditionArrayBoolean(arrayBoolean);
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
    const topLevelNodes = [];

    const instancesOfDiagnosticByDd = state$.diagnostics[dd.diagnostic_id].instances;
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

    const allNodesAnsweredInDd = topLevelNodes.map((topNode) => this.recursiveNodeDd(state$, topNode, dd));

    return reduceConditionArrayBoolean(allNodesAnsweredInDd);
  };

  /**
   * Calculate condition to display a final diagnostic
   * Verify if the final diagnostic excluded an another one
   */
  calculateCondition = (medicalCase) => {
    const conditionValueTrue = [];
    // Generate only the top_condition with conditionValue to true => they are not disabled
    this.top_conditions.map((condition) => {
      const findDDinNode = medicalCase.nodes[condition.first_node_id].dd.find((d) => d.id === this.diagnostic_id);
      if (findDDinNode.conditionValue === true) {
        conditionValueTrue.push(condition);
      }
    });

    // Return the status of this dd
    const statusOfDD = this.getStatusOfDD(medicalCase, this);

    // If this FD can be excluded by other high-priority FD
    this.excluded_final_diagnostics.forEach((excludedByFinalDiagnostic) => {
      const excludingNode = medicalCase.nodes[excludedByFinalDiagnostic];
      // If this other high-priority FD is true so this is always false
      if (excludingNode.calculateCondition(medicalCase) === true) {

        return false;
      }
    });

    if (statusOfDD === false) {
      return false;
    }
    if (statusOfDD === null) {
      return null;
    }
    if (statusOfDD === true) {
      const tempDd = { ...this, top_conditions: conditionValueTrue };
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
    const medicalCase = store.getState();
    const { nodes } = medicalCase;

    const finalDiagnostics = nodes.filterByType(nodeTypes.finalDiagnostic);

    const finalDiagnosticsNull = [];
    const finalDiagnosticsTrue = [];
    const finalDiagnosticsFalse = [];

    for (const index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        const finalDiagnostic = finalDiagnostics[index];
        const complaintCategory = nodes[finalDiagnostic.cc];

        const condition = finalDiagnostic.calculateCondition(medicalCase);

        // If complaintCategory is not selected, I know it's ugly but what can I do ?
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
          default:
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
