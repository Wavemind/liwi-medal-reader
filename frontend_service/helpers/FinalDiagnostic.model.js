// @flow

import find from 'lodash/find';
import * as _ from 'lodash';
import reduce from 'lodash/reduce';
import { nodeFilterByType } from './Node.model';
import { store } from '../store';
import { nodeTypes } from '../constants';
import { calculateCondition, comparingBooleanOr, comparingTopConditions, reduceConditionArrayBoolean } from '../algorithm/conditionsHelpers.algo';
import { healthCareIsExcluded } from './HealthCares.model';

/**
 * Check the current status of this instance and if it's true, go to next node
 * @param algorithm
 * @param medicalCase
 * @param instance
 * @param dd
 * @returns {null|boolean}
 */
const recursiveNodeDd = (algorithm, medicalCase, instance, dd) => {
  const mcNode = medicalCase.nodes[instance.id];
  const instanceConditionValue = find(mcNode.dd, (p) => p.id === dd.diagnostic_id).conditionValue;

  // Get the condition of the instance link
  const instanceCondition = calculateCondition(algorithm, instance, medicalCase);

  // The condition path is not answered
  if ((mcNode.answer === null && instanceCondition === true) || instanceCondition === null) {
    return null;
  }

  // The condition path is not respected so we cant go deeper
  if (instanceCondition === false && instanceConditionValue === false) {
    return false;
  }

  // Remove path other dd
  const childrenWithoutOtherDd = instance.children.filter((id) => {
    return !(medicalCase.nodes[id].type === nodeTypes.finalDiagnostic && medicalCase.nodes[id].id !== dd.id);
  });

  const recursif = childrenWithoutOtherDd.map((childId) => {
    const child = medicalCase.nodes[childId];
    // If this is not the final DD we calculate the conditionValue of the child
    if (child.type === nodeTypes.question || child.type === nodeTypes.questionsSequence) {
      return recursiveNodeDd(algorithm, medicalCase, algorithm.diagnostics[dd.diagnostic_id].instances[child.id], dd);
    }
    if (child.id === dd.id && child.type === nodeTypes.finalDiagnostic) {
      const top_conditions = _.filter(dd.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
      // We get the condition of the final link
      const arrayBoolean = top_conditions.map((condition) => {
        return comparingTopConditions(condition, medicalCase);
      });
      return reduceConditionArrayBoolean(arrayBoolean);
    }
  });

  return reduceConditionArrayBoolean(recursif);
};

/**
 * Calculate status of a final diagnostic
 * @param algorithm
 * @param medicalCase
 * @param dd
 * @returns {boolean}
 */
const getStatusOfDD = (algorithm, medicalCase, dd) => {
  const topLevelNodes = [];
  const instancesOfDiagnosticByDd = algorithm.diagnostics[dd.diagnostic_id].instances;

  Object.keys(instancesOfDiagnosticByDd).forEach((instanceId) => {
    const topLevelNode = instancesOfDiagnosticByDd[instanceId].top_conditions.length === 0;
    const isNotRelatedToTreatmentManagement = instancesOfDiagnosticByDd[instanceId].final_diagnostic_id === null;

    if (topLevelNode && isNotRelatedToTreatmentManagement) {
      topLevelNodes.push(instancesOfDiagnosticByDd[instanceId]);
    }
  });

  const allNodesAnsweredInDd = topLevelNodes.map((topNode) => recursiveNodeDd(algorithm, medicalCase, topNode, dd));

  return reduceConditionArrayBoolean(allNodesAnsweredInDd);
};

/**
 * Calculate condition to display a final diagnostic.
 * Verify if the final diagnostic excluded an another one
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {null|boolean}
 */
export const finalDiagnosticCalculateCondition = (algorithm, medicalCase, mcFinalDiagnostic) => {
  const currentFinalDiagnostic = algorithm.nodes[mcFinalDiagnostic.id];
  const conditionValueTrue = [];
  // Generate only the top_condition with conditionValue to true => they are not disabled
  currentFinalDiagnostic.top_conditions.forEach((condition) => {
    const findDDinNode = medicalCase.nodes[condition.first_node_id].dd.find((d) => d.id === currentFinalDiagnostic.diagnostic_id);
    if (findDDinNode.conditionValue === true) {
      conditionValueTrue.push(condition);
    }
  });

  // Return the status of this dd
  const statusOfDD = getStatusOfDD(algorithm, medicalCase, mcFinalDiagnostic);

  // If this FD can be excluded by other high-priority FD
  const isExcluded = currentFinalDiagnostic.excluding_final_diagnostics.some(
    (excludedByFinalDiagnostic) =>
      // Exclude diagnostic if other diagnoses is available and agreed
      finalDiagnosticCalculateCondition(algorithm, medicalCase, medicalCase.nodes[excludedByFinalDiagnostic]) === true &&
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
    const tempDd = { ...currentFinalDiagnostic, top_conditions: conditionValueTrue };

    const parents = (top_conditions) => {
      return top_conditions.map((top) => top.first_node_id);
    };
    return calculateCondition(algorithm, tempDd, medicalCase) && parentsConditionValue(algorithm.diagnostics[tempDd.diagnostic_id], parents, conditionValueTrue, medicalCase);
  }
};

/**
 * Return all the drugs that must be shown for the current final diagnostic
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {[]} - All the drugs that must be shown for the current final diagnostic
 */
export const finalDiagnosticGetDrugs = (algorithm, medicalCase, mcNode) => {
  const drugsAvailable = [];
  const parents = (top_conditions) => {
    return top_conditions.map((top) => top.first_node_id);
  };

  Object.keys(mcNode.drugs).forEach((drugId) => {
    const drug = medicalCase.nodes[drugId];
    if (parentsConditionValue(mcNode, parents, mcNode.drugs[drugId].top_conditions, medicalCase) && !healthCareIsExcluded(medicalCase, algorithm, drug)) {
      drugsAvailable.push(drug);
    }
  });

  return drugsAvailable;
};

/**
 * Return all the managements that must be shown for the current final diagnostic
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {[]} - All the managements that must be shown for the current final diagnostic
 */
export const finalDiagnosticGetManagements = (algorithm, medicalCase, mcNode) => {
  const managementsAvailable = [];
  const parents = (top_conditions) => {
    return top_conditions.map((top) => top.first_node_id);
  };

  Object.keys(mcNode.managements).forEach((managementId) => {
    const management = medicalCase.nodes[managementId];
    if (parentsConditionValue(mcNode, parents, mcNode.managements[managementId].top_conditions, medicalCase) && !healthCareIsExcluded(medicalCase, algorithm, management)) {
      managementsAvailable.push(management);
    }
  });

  return managementsAvailable;
};

/**
 * Recursive function that calculate the value of all your parents
 * @param mcNode - node in medical case
 * @param parentsTopConditions - method mapping top conditions
 * @param top_conditions
 * @param medicalCase
 * @returns {boolean|*}
 */
const parentsConditionValue = (mcNode, parentsTopConditions, top_conditions, medicalCase) => {
  if (top_conditions.length > 0) {
    const topConditionResults = top_conditions.map((conditions) => comparingTopConditions(conditions, medicalCase) && parentsConditionValue(mcNode, parentsTopConditions, mcNode.instances[conditions.first_node_id].top_conditions, medicalCase));
    const conditionValueResult = reduce(
      topConditionResults,
      (result, value) => {
        return comparingBooleanOr(result, value);
      },
      false
    );
    if (conditionValueResult) {
      return parentsTopConditions(top_conditions).some((parentId) => parentsConditionValue(mcNode, parentsTopConditions, mcNode.instances[parentId].top_conditions, medicalCase));
    }
    return false;
  }
  return true;
};

/**
 * Returns all the FinalDiagnostics by their status
 * @param algorithm
 * @returns {{excluded: [], not_defined: [], included: []}}
 */
export const finalDiagnosticAll = (algorithm) => {
  const medicalCase = store.getState();
  const { nodes } = algorithm;

  const finalDiagnostics = nodeFilterByType(nodes, nodeTypes.finalDiagnostic);

  const finalDiagnosticsNull = [];
  const finalDiagnosticsTrue = [];
  const finalDiagnosticsFalse = [];

  for (const index in finalDiagnostics) {
    if (finalDiagnostics.hasOwnProperty(index)) {
      const finalDiagnostic = finalDiagnostics[index];
      const complaintCategory = nodes[finalDiagnostic.cc];

      const condition = finalDiagnosticCalculateCondition(algorithm, medicalCase, finalDiagnostic);

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
};

/**
 * Returns all the final diagnostics that are either manually added or agreed by the clinician
 * @param medicalCase - The current state of the medical case
 * @returns {Array<Integer>} - Returns an array with all the ids of the final diagnostics
 */
export const finalDiagnosticAgreed = (medicalCase) => {
  const finalDiagnostics = [];
  Object.keys(medicalCase.diagnoses.proposed).map((diagnoseId) => {
    const diagnose = medicalCase.diagnoses.proposed[diagnoseId];
    if (diagnose.agreed) {
      finalDiagnostics.push(diagnose.id);
    }
  });
  return finalDiagnostics.concat(Object.keys(medicalCase.diagnoses.additional).map((diagnoseId) => parseInt(diagnoseId)));
};

/**
 * Returns all the final diagnostics that are either manually added or agreed by the clinician
 * @param medicalCase - The current state of the medical case
 * @returns {Array<Integer>} - Returns an array with all the diagnoses of the final diagnostics
 */
export const finalDiagnosticAgreedObject = (medicalCase) => {
  const finalDiagnostics = [];
  Object.keys(medicalCase.diagnoses.proposed).map((diagnoseId) => {
    const diagnose = medicalCase.diagnoses.proposed[diagnoseId];
    if (diagnose.agreed) {
      finalDiagnostics.push(diagnose);
    }
  });
  return finalDiagnostics.concat(Object.keys(medicalCase.diagnoses.additional).map((diagnoseId) => medicalCase.diagnoses.additional[diagnoseId]));
};
