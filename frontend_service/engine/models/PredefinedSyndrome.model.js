// @flow

import { NodeModel } from './Node.model';
import { InclusionsNodeModel } from './InclusionsNode.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import { LinkNodeModel } from './Link.model';

interface PredefinedSyndromeInterface {
  answer: string;
  answers: Object;
  description: string;
  label: string;
  dd: Array<Object>;
  ps: Array<Object>;
  nodes: Object;
  inclusions: InclusionsNodeModel;
}

export class PredefinedSyndromeModel extends NodeModel
  implements PredefinedSyndromeInterface {
  constructor(props) {
    super(props);

    const {
      answer = null,
      answers = {},
      description = '',
      label = '',
      dd = [],
      qs = [],
      medicalCase = {},
      conditions = {},
      nodes = {},
      top_conditions = {},
    } = props;

    this.description = description;
    this.label = label;
    this.answer = answer;
    this.answers = answers;
    this.dd = dd;
    this.qs = qs;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.nodes = nodes;

    this.inclusions = new InclusionsNodeModel({
      qs: qs,
      dd,
      medicalCase,
    });

    this.requirement = new RequirementNodeModel({ ...props });
    this.instanceLink();

  }

  instanceLink() {
    Object.keys(this.nodes).map(id => {
      this.nodes[id] = new LinkNodeModel({...this.nodes[id]})
    })
  }
}
