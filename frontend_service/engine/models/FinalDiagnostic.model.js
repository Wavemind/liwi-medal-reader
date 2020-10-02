// @flow

import find from 'lodash/find';
import * as _ from 'lodash';
import reduce from 'lodash/reduce';
import { NodeModel } from './Node.model';
import { calculateCondition, comparingBooleanOr, comparingTopConditions, reduceConditionArrayBoolean } from '../../algorithm/conditionsHelpers.algo';
import { store } from '../../store';
import { nodeTypes } from '../../constants';

export class FinalDiagnosticModel extends NodeModel {
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
  recursiveNodeDd = (algorithm, medicalCase, instance, dd) => {
    /**
     * Initial Var
     */
    const currentNode = medicalCase.nodes[instance.id];
    const instanceConditionValue = find(currentNode.dd, (p) => p.id === dd.diagnostic_id).conditionValue;

    /**
     * Get the condition of the instance link
     * Do not change to this.calculateCondition -> infinite loop
     */
    const instanceCondition = calculateCondition(algorithm, instance, medicalCase);

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
        return this.recursiveNodeDd(algorithm, medicalCase, medicalCase.diagnostics[dd.diagnostic_id].instances[child.id], dd);
      }
      if (child.id === dd.id && child.type === nodeTypes.finalDiagnostic) {
        const top_conditions = _.filter(dd.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
        // We get the condition of the final link
        const arrayBoolean = top_conditions.map((condition) => {
          return comparingTopConditions(condition, medicalCase);
        });
        // calcul final path
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
  calculateCondition = (algorithm, medicalCase) => {
    const currentNode = algorithm.nodes[this.id];
    const conditionValueTrue = [];
    // Generate only the top_condition with conditionValue to true => they are not disabled
    currentNode.top_conditions.map((condition) => {
      const findDDinNode = medicalCase.nodes[condition.first_node_id].dd.find((d) => d.id === currentNode.diagnostic_id);
      if (findDDinNode.conditionValue === true) {
        conditionValueTrue.push(condition);
      }
    });

    // Return the status of this dd
    const statusOfDD = this.getStatusOfDD(medicalCase, this);

    // If this FD can be excluded by other high-priority FD
    const isExcluded = currentNode.excluding_final_diagnostics.some(
      (excludedByFinalDiagnostic) =>
        // Exclude diagnostic if other diagnoses is available and agreed
        medicalCase.nodes[excludedByFinalDiagnostic].calculateCondition(algorithm, medicalCase) === true &&
        medicalCase.diagnoses.proposed[excludedByFinalDiagnostic] !== undefined &&
        medicalCase.diagnoses.proposed[excludedByFinalDiagnostic].agreed === true
    );

    if (statusOfDD === false || isExcluded) {
      return false;
    }
    if (statusOfDD === null) {
      return null;
    }
    if (statusOfDD === true) {
      const tempDd = { ...currentNode, top_conditions: conditionValueTrue };
      return calculateCondition(algorithm, tempDd, medicalCase);
    }
  };

  /**
   * Return all the drugs that must be shown for the current final diagnostic
   * @returns {Array<DrugModel>} - All the drugs that must be shown for the current final diagnostic
   */
  getDrugs = (medicalCase) => {
    const drugsAvailable = [];
    const parents = (top_conditions) => {
      return top_conditions.map((top) => top.first_node_id);
    };

    Object.keys(this.drugs).forEach((drugId) => {
      const drug = medicalCase.nodes[drugId];
      if (this.parentsConditionValue(parents, this.drugs[drugId].top_conditions, medicalCase) && !drug.isExcluded(medicalCase)) {
        drugsAvailable.push(drug);
      }
    });

    return drugsAvailable;
  };

  /**
   * Return all the managements that must be shown for the current final diagnostic
   * @param medicalCase
   * @returns {[]}
   */
  getManagements = (medicalCase) => {
    const managementsAvailable = [];
    const parents = (top_conditions) => {
      return top_conditions.map((top) => top.first_node_id);
    };

    Object.keys(this.managements).forEach((managementId) => {
      const management = medicalCase.nodes[managementId];
      if (this.parentsConditionValue(parents, this.managements[managementId].top_conditions, medicalCase) && !management.isExcluded(medicalCase)) {
        managementsAvailable.push(management);
      }
    });

    return managementsAvailable;
  };

  /**
   * Recursive function that calculate the value of all your parents
   * @param parentsTopConditions - method mapping top conditions
   * @param top_conditions - the condition of you 1st level parent
   * @param medicalCase - current medical case
   * @returns {boolean}
   */
  parentsConditionValue = (parentsTopConditions, top_conditions, medicalCase) => {
    if (top_conditions.length > 0) {
      const topConditionResults = top_conditions.map((conditions) => comparingTopConditions(conditions, medicalCase));
      const conditionValueResult = reduce(
        topConditionResults,
        (result, value) => {
          return comparingBooleanOr(result, value);
        },
        false
      );
      if (conditionValueResult) {
        return parentsTopConditions(top_conditions).some((parentId) => this.parentsConditionValue(parentsTopConditions, this.instances[parentId].top_conditions, medicalCase));
      }
      return false;
    }
    return true;
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
  static all(algorithm) {
    const medicalCase = store.getState();
    const { nodes } = algorithm;

    const finalDiagnostics = NodeModel.filterByType(nodes, nodeTypes.finalDiagnostic);

    const finalDiagnosticsNull = [];
    const finalDiagnosticsTrue = [];
    const finalDiagnosticsFalse = [];

    for (const index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        const finalDiagnostic = finalDiagnostics[index];
        const complaintCategory = nodes[finalDiagnostic.cc];

        const condition = finalDiagnostic.calculateCondition(algorithm, medicalCase);

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

  /**
   * Retrurns all the final diagnostics that are either manually added or agreed by the clinician
   * @param medicalCase - The current state of the medical case
   * @returns {Array<Integer>} - Returns an array with all the ids of the final diagnostics
   */
  static getAgreed(medicalCase) {
    const finalDiagnostics = [];
    Object.keys(medicalCase.diagnoses.proposed).map((diagnoseId) => {
      const diagnose = medicalCase.diagnoses.proposed[diagnoseId];
      if (diagnose.agreed) {
        finalDiagnostics.push(diagnose.id);
      }
    });
    return finalDiagnostics.concat(Object.keys(medicalCase.diagnoses.additional).map((diagnoseId) => parseInt(diagnoseId)));
  }

  /**
   * Retrurns all the final diagnostics that are either manually added or agreed by the clinician
   * @param medicalCase - The current state of the medical case
   * @returns {Array<Integer>} - Returns an array with all the diagnoses of the final diagnostics
   */
  static getAgreedObject(medicalCase) {
    const finalDiagnostics = [];
    Object.keys(medicalCase.diagnoses.proposed).map((diagnoseId) => {
      const diagnose = medicalCase.diagnoses.proposed[diagnoseId];
      if (diagnose.agreed) {
        finalDiagnostics.push(diagnose);
      }
    });
    return finalDiagnostics.concat(Object.keys(medicalCase.diagnoses.additional).map((diagnoseId) => medicalCase.diagnoses.additional[diagnoseId]));
  }
}
