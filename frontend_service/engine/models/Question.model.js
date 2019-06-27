// @flow

import { NodeModel } from './Node.model';
import { priorities } from '../../constants';

const { basic, mandatory, triage, priority } = priorities;

 interface QuestionInterface {
  answer: string;
  answers: Object;
  description: string;
  label: string;
  category: string;
  counter: number;
  dd: Array<Object>;
  display_format: string;
  priority: basic | mandatory | triage | priority;
  ps: Array<Object>;
  value: number;
  value_format: string;
}

export class QuestionModel extends NodeModel implements QuestionInterface {
  constructor(props) {
    super(props);

    const {
      answer = null,
      answers = {},
      description = '',
      label = '',
      category = '',
      counter = 0,
      dd = [],
      display_format = '',
      priority = '',
      qs = [],
      value = '',
      value_format = '',
    } = props;

    this.description = description;
    this.label = label;
    this.answer = answer;
    this.answers = answers;
    this.category = category;
    this.counter = counter;
    this.dd = dd;
    this.display_format = display_format;
    this.priority = priority;
    this.qs = qs;
    this.value = value;
    this.value_format = value_format;

  }
}
