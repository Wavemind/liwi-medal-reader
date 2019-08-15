// @flow

import { NodeModel } from './Node.model';
import { RequirementNodeModel } from './RequirementNodeModel';
import { InstanceModel } from './Instance.model';

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
      instances = {},
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
    this.instances = instances;
    this.category = category;

    this.requirement = new RequirementNodeModel({ ...props });
    this.instanceLink();
  }

  instanceLink() {
    Object.keys(this.instances).map((id) => {
      this.instances[id] = new InstanceModel({ ...this.instances[id] });
    });
  }
}
