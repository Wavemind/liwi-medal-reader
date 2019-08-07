// @flow

import { NodeModel } from './Node.model';
import { priorities } from '../../constants';

const zScore = require('../../algorithm/z_score_male_table');

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
      stage = '',
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
    this.stage = stage;

  }

  // Params age (in days), weight (in kg)
  // Return range -4 to 4
  // Calculate Z score based on age and weight.
  calculateZScore(age, weight) {
    let value = 0;
    let previousKey = null;
    Object.keys(zScore[age]).map((key) => {
      if (zScore[age][key] > weight) {
        value = this.zScoreCorrelation(previousKey);
        return true;
      }
      previousKey = key;
    });
    return value;
  }

  // Params zScoreKey
  // Return integer value
  // Map key to return integer value
  zScoreCorrelation(zScoreKey) {
    switch (zScoreKey) {
      case 'SD4neg':
        return -4;
      case 'SD3neg':
        return -3;
      case 'SD2neg':
        return -2;
      case 'SD1neg':
        return -1;
      case 'SD0':
        return 0;
      case 'SD1':
        return 1;
      case 'SD2':
        return 2;
      case 'SD3':
        return 3;
      case 'SD4':
        return 4;
      default:
        console.log('This value doesn\'t exist');
    }
  }
}
