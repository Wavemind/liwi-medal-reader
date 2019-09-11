// @flow
import _ from 'lodash';
import { categories, nodesType } from '../../constants';
import { NodeModel } from './Node.model';
import { QuestionsSequenceModel } from './QuestionsSequenceModel';
import { QuestionModel } from './Question.model';
import { ManagementModel } from './Management.model';
import { TreatmentModel } from './Treatment.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';
import { QuestionsSequenceScoredModel } from './QuestionsSequenceScored.model';
import { calculateCondition } from '../../algorithm/algoConditionsHelpers';

interface NodeInterface {}

export class NodesModel implements NodeInterface {
  constructor(props) {
    this.instantiateNodes(props);
  }

  filterByCategory(category) {
    return _.filter(this, (n) => n.category === category);
  }

  filterByType(type) {
    return _.filter(this, (n) => n.type === type);
  }

  /**
   * Verify if all nodes in params is answered
   * @params nodes: array
   * @return allAnswered: boolean
   * return true if all nodes is answered
   */
  isAllAnswered(nodes) {
    return !nodes.some((a) => {
      return a.answer === null;
    });
  }

  /**
   * Return filtered nodes on multiple params
   * @params filter : array
   * [{ by: 'category', operator: 'equal', value: categories.symptom },
   * { by: 'stage', operator: 'equal', value: stage.consultation },
   * { by: 'counter', operator: 'more', value: 0 },]
   */
  filterBy(filters) {
    this.filterByConditionValue();
    return _.filter(this, (node) => {
      let nodes = filters.every((filter) => {
        switch (filter.operator) {
          case 'equal':
            return node[filter.by] === filter.value;
          case 'more':
            return node[filter.by] > filter.value;
        }
      });
      return nodes;
    });
  }

  filterByStage(stage) {
    return _.filter(this, (n) => n.stage === stage);
  }

  filterByCounterGreaterThanZero() {
    this.filterByConditionValue();
    return _.filter(this, (n) => n.counter > 0);
  }

  filterByConditionValue() {
    try {
      Object.keys(this).map((nodeId) => {
        if (this[nodeId].type === 'Question') {
          this[nodeId].counter = 0;

          this[nodeId].dd.map((dd) => {
            dd.conditionValue ? this[nodeId].counter++ : null;
          });
          // Map trough PS if it is in an another PS itself
          this[nodeId].qs.map((qs) => {
            qs.conditionValue ? this[nodeId].counter++ : null;
          });
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   ** For each final diagnostics we return the management and treatment associate
   * @return
   * Object healthCares : {
   *   managements: {},
   *   treatments: {},
   * }
   *
   */
  getHealthCares() {
    let healthCares = { managements: {}, treatments: {} };

    // Filter by final diagnostic
    const finalDiagnostics = this.filterByType(nodesType.finalDiagnostic);

    for (let index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        let finalDiagnostic = finalDiagnostics[index];
        let condition = finalDiagnostic.calculateCondition();
        if (condition === true) {
          for (let indexManagement in finalDiagnostic.managements) {
            if (finalDiagnostic.managements.hasOwnProperty(indexManagement)) {
              let managementBoolean = calculateCondition(
                finalDiagnostic.managements[indexManagement]
              );
              if (managementBoolean === true) {
                healthCares.managements[indexManagement] = this[
                  indexManagement
                ];
              }
            }
          }

          for (let indexTreatment in finalDiagnostic.treatments) {
            if (finalDiagnostic.treatments.hasOwnProperty(indexTreatment)) {
              let treatmentBoolean = calculateCondition(
                finalDiagnostic.treatments[indexTreatment]
              );
              if (treatmentBoolean === true) {
                healthCares.treatments[indexTreatment] = this[indexTreatment];
              }
            }
          }
        }
      }
    }
    return healthCares;
  }

  /**
   * Return all the questions are in Healtcares from Final Diagnostic are true
   * @return Object {questions}
   * Nodes of Management And Treatment nodes
   */
  getHealthCaresQuestions() {
    let questions = {};
    const finalDiagnostics = this.filterByType(nodesType.finalDiagnostic);

    for (let index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        let finalDiagnostic = finalDiagnostics[index];
        let condition = finalDiagnostic.calculateCondition();
        if (condition === true) {
          for (let indexManagement in finalDiagnostic.managements) {
            if (finalDiagnostic.managements.hasOwnProperty(indexManagement)) {
              let m = this[indexManagement];

              let q = m.getQuestions(
                finalDiagnostic.managements[indexManagement]
              );
              questions = {
                ...questions,
                ...q,
              };
            }
          }

          for (let indexTreatment in finalDiagnostic.treatments) {
            if (finalDiagnostic.treatments.hasOwnProperty(indexTreatment)) {
              let t = this[indexTreatment];

              let q = t.getQuestions(
                finalDiagnostic.treatments[indexTreatment]
              );
              questions = {
                ...questions,
                ...q,
              };
            }
          }
        }
      }
    }
    return questions;
  }

  /**
   * Instantiate all the nodes received
   *
   * @params nodes : nodes to instantiate
   */
  instantiateNodes(nodes) {
    Object.keys(nodes).forEach((i) => {
      let node = nodes[i];
      this[i] = this.instantiateNode(node);
    });
  }

  /**
   * Node factory
   * Instantiate new Node base on node type
   *
   * @params node : node to instantiate
   */
  instantiateNode(node) {
    let instantiatedNode;

    if (node instanceof NodeModel) {
      return node;
    }

    // Based on the node type
    switch (node.type) {
      case nodesType.questionsSequence:
        switch (node.category) {
          case categories.scored:
            instantiatedNode = new QuestionsSequenceScoredModel({
              ...node,
              medicalCase: this,
            });
            break;
          default:
            instantiatedNode = new QuestionsSequenceModel({
              ...node,
              medicalCase: this,
            });
            break;
        }
        break;

      case nodesType.question:
        instantiatedNode = new QuestionModel({
          ...node,
          medicalCase: this,
        });
        break;
      case nodesType.healthCare:
        switch (node.category) {
          case categories.management:
            instantiatedNode = new ManagementModel({ ...node });
            break;
          case categories.treatment:
            instantiatedNode = new TreatmentModel({ ...node });
            break;
        }
        break;
      case nodesType.finalDiagnostic:
        instantiatedNode = new FinalDiagnosticModel({ ...node });
        break;
      default:
        break;
    }

    return instantiatedNode;
  }
}
