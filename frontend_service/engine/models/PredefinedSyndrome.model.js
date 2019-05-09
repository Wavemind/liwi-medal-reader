// @flow

import { NodeModel } from './Node.model';
import { InclusionsNodeModel } from './InclusionsNode.model';
import { ConditionsNodeModel } from './ConditionsNode.model';

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
      ps = [],
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
    this.ps = ps;
    this.conditions = conditions;
    this.top_conditions = top_conditions;
    this.nodes = nodes;

    this.inclusions = new InclusionsNodeModel({
      ps,
      dd,
      medicalCase,
    });

    this.conditions = new ConditionsNodeModel({ ...props });

  }
}
