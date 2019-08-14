// @flow

import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import { LinkNodeModel } from './Link.model';

interface QuestionsSequenceInterface {
  answer: string;
  answers: Object;
  description: string;
  label: string;
  dd: Array<Object>;
  ps: Array<Object>;
  nodes: Object;
}

export class QuestionsSequenceModel extends NodeModel
  implements QuestionsSequenceInterface {
  constructor(props) {
    super(props);

    const {
      answer = null,
      answers = {},
      description = '',
      label = '',
      dd = [],
      qs = [],
      conditions = {},
      nodes = {},
      top_conditions = {},
      category = ''
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
    this.category = category;

    this.requirement = new RequirementNodeModel({ ...props });
    this.instanceLink();
  }

  instanceLink() {
    Object.keys(this.nodes).map((id) => {
      this.nodes[id] = new LinkNodeModel({ ...this.nodes[id] });
    });
  }
}
