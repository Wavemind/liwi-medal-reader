// @flow
import { categories, nodesType } from '../../constants';
import { NodeModel } from './Node.model';
import { PredefinedSyndromeModel } from './PredefinedSyndrome.model';
import { QuestionModel } from './Question.model';
import { ManagementModel } from './Management.model';
import { TreatmentModel } from './Treatment.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';
import _ from 'lodash';

const { qs, d, fd, m, q, t } = nodesType;

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

  instanceNodeModel(nodes) {
    Object.keys(nodes).forEach((i) => {
      let node = nodes[i];
      this[i] = this._instanceChild(node);
    });
  }

  _instanceChild(node) {
    let instinctiveNode;

    if (node instanceof NodeModel) {
      return node;
    }

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
