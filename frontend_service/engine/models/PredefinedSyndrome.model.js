// @flow

import { NodeModel } from './Node.model';

export interface PredefinedSyndromeInterface {
  answer: string;
  answers: Object;
  description: string;
  label: string;
  dd: Array<Object>;
  ps: Array<Object>;
  nodes: Object;
}

export class PredefinedSyndromeModel extends NodeModel implements PredefinedSyndromeInterface {
  constructor(props) {
    super(props);

    const {
      answer = null,
      answers = {},
      description = '',
      label = '',
      dd = [],
      ps = [],
    } = props;

    this.description = description;
    this.label = label;
    this.answer = answer;
    this.answers = answers;
    this.dd = dd;
    this.ps = ps;
  }
}
