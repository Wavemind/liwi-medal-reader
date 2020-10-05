// @flow
/* eslint-disable no-case-declarations */
import { NodeModel } from './Node.model';
import { finalDiagnosticAgreed, finalDiagnosticAgreedObject, FinalDiagnosticModel } from './FinalDiagnostic.model';
import { nodeTypes } from '../../constants';

interface HealthCaresInterface {}

export class HealthCaresModel extends NodeModel implements HealthCaresInterface {
  constructor(props) {
    super(props);

    const { id } = props;

    this.id = id;
    this.healthCareObject = 'healthCares';
  }

  /**
   * Check if a healthCare is excluded by an another
   * @param medicalCase
   * @param algorithm
   * @returns {Array<boolean>}
   */
  isExcluded = (medicalCase, algorithm) => {
    const finalDiagnostics = finalDiagnosticAgreedObject(medicalCase);
    const healthCare = algorithm.nodes[this.id];

    return Object.keys(finalDiagnostics)
      .map((index) => {
        const finalDiagnostic = finalDiagnostics[index];
        return Object.keys(finalDiagnostic[this.healthCareObject]).some((healthCareId) => {
          return healthCare.excluded_nodes_ids.includes(parseInt(healthCareId)) && finalDiagnostic[this.healthCareObject][healthCareId].agreed === true;
        });
      })
      .some((healthCareValue) => healthCareValue);
  };

  /**
   * Return a list of question that need to be answered in order to define the health cares
   * @return Object {questions} list of question that need to be answered
   */
  static getHealthCaresQuestions(algorithm, medicalCase) {
    const { nodes } = algorithm;
    let questions = {};
    const finalDiagnostics = finalDiagnosticAgreed(medicalCase);

    finalDiagnostics.forEach((finalDiagnosticId) => {
      const finalDiagnostic = nodes[finalDiagnosticId];
      Object.keys(finalDiagnostic.instances).forEach((instanceId) => {
        if (nodes[instanceId].df.some((df) => df.conditionValue)) {
          if (nodes[instanceId].type === nodeTypes.questionsSequence) {
            nodes.getQuestionsInQs(algorithm, medicalCase, questions, nodes[instanceId]);
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
  }

  /**
   * Recursive call to get question in QS from QS
   *
   * @params [Object] state$, [Object] questions, [Object] node: the node we want questions
   * @return nothing : Immutability
   */
  static getQuestionsInQs(algorithm, medicalCase, questions, node) {
    const { nodes } = algorithm;
    Object.keys(node.instances).forEach((id) => {
      const mcNode = medicalCase.nodes[id];
      if (nodes[id].type === nodeTypes.questionsSequence) {
        this.getQuestionsInQs(algorithm, medicalCase, questions, nodes[id]);
      } else if (mcNode.qs.some((qs) => qs.conditionValue)) {
        questions[id] = nodes[id];
      }
    });
  }
}
