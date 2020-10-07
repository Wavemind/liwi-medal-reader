// @flow
import { finalDiagnosticAgreed, finalDiagnosticAgreedObject } from './FinalDiagnostic.model';
import { nodeTypes } from '../constants';

/**
 * Check if a healthCare is excluded by an another
 * @param medicalCase
 * @param algorithm
 * @param mcNode
 * @returns {boolean}
 */
export const healthCareIsExcluded = (medicalCase, algorithm, mcNode) => {
  const finalDiagnostics = finalDiagnosticAgreedObject(medicalCase);
  const healthCare = algorithm.nodes[mcNode.id];

  return Object.keys(finalDiagnostics)
    .map((index) => {
      const finalDiagnostic = finalDiagnostics[index];
      return Object.keys(finalDiagnostic[mcNode.healthCareObject]).some((healthCareId) => {
        return healthCare.excluded_nodes_ids.includes(parseInt(healthCareId)) && finalDiagnostic[mcNode.healthCareObject][healthCareId].agreed === true;
      });
    })
    .some((healthCareValue) => healthCareValue);
};

/**
 * Return a list of question that need to be answered in order to define the health cares
 * @param algorithm
 * @param medicalCase
 * @returns {{}}
 */
export const healthCaresGetQuestions = (algorithm, medicalCase) => {
  const { nodes } = medicalCase;
  let questions = {};
  const finalDiagnostics = finalDiagnosticAgreed(medicalCase);

  finalDiagnostics.forEach((finalDiagnosticId) => {
    const finalDiagnostic = nodes[finalDiagnosticId];
    Object.keys(finalDiagnostic.instances).forEach((instanceId) => {
      if (nodes[instanceId].df.some((df) => df.conditionValue)) {
        if (nodes[instanceId].type === nodeTypes.questionsSequence) {
          _getQuestionsInQs(algorithm, medicalCase, questions, algorithm.nodes[instanceId]);
        } else {
          questions = {
            ...questions,
            [instanceId]: nodes[instanceId],
          };
        }
      }
    });
  });

  return questions;
};

/**
 * Recursive call to get question in QS from QS
 * @param algorithm
 * @param medicalCase
 * @param questions
 * @param node
 * @private
 */
const _getQuestionsInQs = (algorithm, medicalCase, questions, node) => {
  const { nodes } = algorithm;
  Object.keys(node.instances).forEach((id) => {
    const mcNode = medicalCase.nodes[id];
    if (nodes[id].type === nodeTypes.questionsSequence) {
      _getQuestionsInQs(algorithm, medicalCase, questions, nodes[id]);
    } else if (mcNode.qs.some((qs) => qs.conditionValue)) {
      questions[id] = mcNode;
    }
  });
};
