// @flow

import { NodeModel } from './Node.model';
import { InclusionsNodeModel } from './ConditionsNode.model';

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
      medicalCase = {}
    } = props;

    this.description = description;
    this.label = label;
    this.answer = answer;
    this.answers = answers;
    this.dd = dd;
    this.ps = ps;

    // this.getMedicalCase();
    console.log(medicalCase)
    this.inclusions = new InclusionsNodeModel({
      ps: ps,
      dd: dd,
    });
  }
}
