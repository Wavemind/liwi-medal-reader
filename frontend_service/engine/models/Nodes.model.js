// @flow
import _ from 'lodash';
import { categories, nodesType } from '../../constants';
import { NodeModel } from './Node.model';
import { PredefinedSyndromeModel } from './PredefinedSyndrome.model';
import { QuestionModel } from './Question.model';
import { ManagementModel } from './Management.model';
import { TreatmentModel } from './Treatment.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';

interface NodeInterface {}

export class NodesModel implements NodeInterface {
  constructor(props) {
    this.instanceNodeModel(props);
  }

  filterByCategory(category) {
    return _.filter(this, (n) => n.category === category);
  }

  filterByType(type) {
    return _.filter(this, (n) => n.type === type);
  }

  isAnsweredNodes(nodes) {
    return nodes.some((a) => {
      return a.answer !== null;
    });
  }

  filterByStage(stage) {
    return _.filter(this, (n) => n.stage === stage);
  }


  /*
  * filters = [
      { by: 'category', operator: 'equal', value: categories.symptom },
      { by: 'stage', operator: 'equal', value: stage.consultation },
      { by: 'counter', operator: 'more', value: 0 },
    ]
  *
  *
  * */
  filterbyMultiple(filters) {
    this.filterByConditionValue();
    return _.filter(this, (node) => {
      let f = filters.every((filter) => {
        switch (filter.operator) {
          case 'equal':
            return node[filter.by] === filter.value;
          case 'more':
            return node[filter.by] > filter.value;
        }
      });
      return f;
    });
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

  // Instance all the nodes
  instanceNodeModel(nodes) {
    Object.keys(nodes).forEach((i) => {
      let node = nodes[i];
      this[i] = this._instanceChild(node);
    });
  }

  // Switch for instance the good model to the node
  _instanceChild(node) {
    let instinctiveNode;

    if (node instanceof NodeModel) {
      return node;
    }

    // By the node type
    switch (node.type) {
      case nodesType.qs:
        instinctiveNode = new PredefinedSyndromeModel({
          ...node,
          medicalCase: this,
        });
        break;

      case nodesType.q:
        instinctiveNode = new QuestionModel({
          ...node,
          medicalCase: this,
        });
        break;
      case nodesType.h:
        switch (node.category) {
          case categories.management:
            instinctiveNode = new ManagementModel({ ...node });
            break;
          case categories.treatment:
            instinctiveNode = new TreatmentModel({ ...node });
            break;
        }
        break;
      case nodesType.fd:
        instinctiveNode = new FinalDiagnosticModel({ ...node });
        break;
      default:
        break;
    }

    return instinctiveNode;
  }
}
