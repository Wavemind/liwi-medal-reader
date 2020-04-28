// @flow
import _ from 'lodash';
import { categories, nodeTypes } from '../../constants';
import { NodeModel } from './Node.model';
import { ManagementModel } from './Management.model';
import { DrugModel } from './Drug.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';
import { QuestionsSequenceScoredModel } from './QuestionsSequenceScored.model';
import { calculateCondition } from '../../algorithm/conditionsHelpers.algo';
import { QuestionsSequenceModel } from './QuestionsSequenceModel';
import { QuestionModel } from './Question.model';

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
   *
   * @params operator string
   *  - AND
   *  - OR
   *
   *  @params formatReturn string
   *  - array
   *  - object
   */
  filterBy(filters, operator = 'OR', formatReturn = 'array', counter = true) {
    this.filterByConditionValue();

    // return the boolean for one filter
    const switchTest = (filter, node) => {
      switch (filter.operator) {
        case 'equal':
          return node[filter.by] === filter.value;
        case 'more':
          return node[filter.by] > filter.value;
      }
    };

    const counterFilter = (filter, node) => {
      if (counter) {
        return switchTest(filter, node) && node.counter > 0;
      }
      return switchTest(filter, node);
    };

    let methodFilteringLodash;

    // Set the right method depending the return format
    if (formatReturn === 'array') {
      // Return new array
      methodFilteringLodash = 'filter';
    } else if (formatReturn === 'object') {
      // Return object and keep key
      methodFilteringLodash = 'pickBy';
    }

    return _[methodFilteringLodash](this, (node) => {
      // According operator to ALL filters
      if (operator === 'AND') {
        // The every() method tests whether all elements in the array pass the test implemented by the provided function.
        // It returns a Boolean value.
        return filters.every((filter) => {
          return counterFilter(filter, node);
        });
      }
      if (operator === 'OR') {
        // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
        // It returns a Boolean value.
        return filters.some((filter) => {
          return counterFilter(filter, node);
        });
      }
    });
  }

  filterByStage(stage) {
    this.filterByConditionValue();
    return _.filter(this, (n) => n.stage === stage);
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
   * For each final diagnostics we return the management and treatment associate
   *  We return all a list of management and a list of treatment are condition true. Not filtered by Final Diagnostics
   *
   * @return
   * Object healthCares : {
   *   managements: {},
   *   drugs: {},
   * }
   *
   */
  getHealthCares() {
    const healthCares = { managements: {}, drugs: {} };

    // Filter by final diagnostic
    const finalDiagnostics = FinalDiagnosticModel.all();

    finalDiagnostics.included.forEach((finalDiagnostic) => {
      Object.keys(finalDiagnostic.managements).forEach((key) => {
        if (calculateCondition(finalDiagnostic.managements[key])) {
          healthCares.managements[key] = this[key];
          healthCares.managements[key].drugDoses = healthCares.managements[key].getDrugDoses();
        }
      });

      Object.keys(finalDiagnostic.drugs).forEach((key) => {
        if (calculateCondition(finalDiagnostic.drugs[key])) {
          healthCares.drugs[key] = this[key];
          healthCares.drugs[key].drugDoses = healthCares.drugs[key].getDrugDoses();
        }
      });
    });
    return healthCares;
  }

  /**
   * Return a list of question that need to be answered in order to define the health cares
   * @return Object {questions} list of question that need to be answered
   */
  getHealthCaresQuestions() {
    let questions = {};
    const finalDiagnostics = this.filterByType(nodeTypes.finalDiagnostic);

    for (const index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        const finalDiagnostic = finalDiagnostics[index];
        const condition = finalDiagnostic.calculateCondition();
        if (condition === true) {
          for (const indexManagement in finalDiagnostic.managements) {
            this[indexManagement].getQuestions(finalDiagnostic);
            if (finalDiagnostic.managements.hasOwnProperty(indexManagement)) {
              const m = this[indexManagement];

              const q = m.getQuestions(finalDiagnostic.managements[indexManagement]);
              questions = {
                ...questions,
                ...q,
              };
            }
          }

          for (const indexTreatment in finalDiagnostic.drugs) {
            if (finalDiagnostic.drugs.hasOwnProperty(indexTreatment)) {
              const t = this[indexTreatment];

              const q = t.getQuestions(finalDiagnostic.drugs[indexTreatment]);
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
      const node = nodes[i];
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
      case nodeTypes.questionsSequence:
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

      case nodeTypes.question:
        instantiatedNode = new QuestionModel({
          ...node,
          medicalCase: this,
        });
        break;
      case nodeTypes.healthCare:
        switch (node.category) {
          case categories.management:
            instantiatedNode = new ManagementModel({ ...node });
            break;
          case categories.drug:
            instantiatedNode = new DrugModel({ ...node });
            break;
        }
        break;
      case nodeTypes.finalDiagnostic:
        instantiatedNode = new FinalDiagnosticModel({ ...node });
        break;
      default:
        break;
    }

    return instantiatedNode;
  }
}
