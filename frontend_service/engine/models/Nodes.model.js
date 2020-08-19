// @flow
import _ from 'lodash';
import { categories, nodeTypes } from '../../constants';
import { NodeModel } from './Node.model';
import { ManagementModel } from './Management.model';
import { DrugModel } from './Drug.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';
import { QuestionsSequenceScoredModel } from './QuestionsSequenceScored.model';
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
  filterBy(filters, diagnostics, operator = 'OR', formatReturn = 'array', counter = true) {
    this.filterByConditionValue(diagnostics);

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

  filterByConditionValue(diagnostics) {
    try {
      Object.keys(this).map((nodeId) => {
        if (this[nodeId].type === 'Question') {
          this[nodeId].counter = 0;
          this[nodeId].dd.map((dd) => {
            !diagnostics[dd.id].isExcludedByComplaintCategory(this) && dd.conditionValue ? this[nodeId].counter++ : null;
          });
          // Map trough PS if it is in an another PS itself
          this[nodeId].qs.map((qs) => {
            const relatedDiagnostics = this[qs.id].dd.some((diagnostic) => !diagnostics[diagnostic.id].isExcludedByComplaintCategory(this));
            relatedDiagnostics && qs.conditionValue ? this[nodeId].counter++ : null;
          });
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Return a list of question that need to be answered in order to define the health cares
   * @return Object {questions} list of question that need to be answered
   */
  getHealthCaresQuestions(medicalCase) {
    let questions = {};
    let finalDiagnostics = Object.keys(medicalCase.diagnoses.proposed).map((diagnoseId) => {
      const diagnose = medicalCase.diagnoses.proposed[diagnoseId];
      if (diagnose.agreed) {
        return diagnose.id;
      }
    });

    finalDiagnostics = finalDiagnostics.concat(Object.keys(medicalCase.diagnoses.additional).map((diagnosesId) => parseInt(diagnosesId)));

    finalDiagnostics.map((finalDiagnosticId) => {
      const finalDiagnostic = this[finalDiagnosticId];
      Object.keys(finalDiagnostic.managements).map((managementId) => {
        const management = this[managementId];
        const question = management.getQuestions(finalDiagnostic.managements[managementId]);
        questions = {
          ...questions,
          ...question,
        };
      });
      Object.keys(finalDiagnostic.drugs).map((drugId) => {
        const drug = this[drugId];
        const question = drug.getQuestions(finalDiagnostic.drugs[drugId]);
        questions = {
          ...questions,
          ...question,
        };
      });
    });

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
