// @flow

import moment from 'moment';
import { NodeModel } from './Node.model';
import { priorities, valueFormats , displayFormats } from '../../constants';
import { store } from '../../store';


const references = {
  'z_score_male_table': require('../../api/z_score_male_table.json'),
  'z_score_female_table': require('../../api/z_score_female_table.json'),
  'heart_rate_table': require('../../api/heart_rate_table.json'),
  'respiratory_rate_table': require('../../api/respiratory_rate_table.json'),
};

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
      formula = '',
      referenced_in = [],
      cc = [],
      reference_table_x_id = 0,
      reference_table_y_id = 0,
      reference_table_male = '',
      reference_table_female = ''
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
    this.formula = formula;
    this.referenced_in = referenced_in;
    this.cc = cc;
    this.reference_table_y_id = reference_table_y_id;
    this.reference_table_x_id = reference_table_x_id;
    this.reference_table_male = reference_table_male;
    this.reference_table_female = reference_table_female;
  }

  /**
   * Calculate condition to display triage question
   * @params medicalCase : object
   * @return isDisplayed : boolean
   */
  isDisplayedInTriage(medicalCase) {
    const conditions = medicalCase.triage.conditions;
    let isDisplayed = true;

    // Skip if there is no conditions
    if (conditions?.[this.id] !== undefined) {
      isDisplayed = false;
      conditions[this.id].map((condition) => {
        if (
          medicalCase.nodes[condition.chief_complaint_id].answer ===
          condition.answer_id
        ) {
          isDisplayed = true;
        }
      });
    }

    return isDisplayed;
  }

  /**
   * Parse the formula and calculate it if possible
   *
   * @param node
   * @returns {number}
   *
   */
  calculateFormula = () => {
    const state$ = store.getState();

    // Regex to find the brackets [] in the formula
    const findBracketId = /\[(.*?)\]/gi;
    let ready = true;

    // Function to change the [id] into the answered value
    const replaceBracketToValue = (item) => {
      // Get the id from the brackets []
      let id = item.match(/\d/g).join('');

      // Get value of this node
      const nodeInBracket = state$.nodes[id];

      if (nodeInBracket.value === null || (nodeInBracket.value === 0 && nodeInBracket.answer === null)) {
        ready = false;
        return item;
      } else {
        switch (nodeInBracket.value_format) {
          case valueFormats.date:
            return moment().diff(moment(nodeInBracket.value).toDate(), 'months');
          default:
            return nodeInBracket.value;
        }
      }
    };
    // Replace every bracket in the formula with it's value
    let formula = this.formula.replace(findBracketId, replaceBracketToValue);

    if (ready) {
      return eval(formula);
    } else {
      return null;
    }
  };

  /**
   * Calculate reference score.
   * @returns refer to reference tables
   */
  calculateReference() {
    const state$ = store.getState();
    let x = state$.nodes[this.reference_table_x_id];
    let y = state$.nodes[this.reference_table_y_id];

    // TODO: Remove when decision about date format is taken
    const dateFormat = this.label === 'Weight for age (z-score)' ? 'days' : 'months';
    x = x.display_format === displayFormats.date ? moment().diff(moment(x.value).toDate(), dateFormat) : x.value;
    y = y.display_format === displayFormats.date ? moment().diff(moment(y.value).toDate(), dateFormat) : y.value;

    const reference = state$.patient.gender === 'male' ? references[this.reference_table_male] : references[this.reference_table_female];
    let value = null;
    let previousKey = null;

    // If X and Y means question is not answered + check if answer is in the scope of the reference table
    if (x !== null && y !== null && (x in reference)) {
      Object.keys(reference[x]).map((key) => {
        if (reference[x][key] > y) {
          value = Number(previousKey);
          return true;
        }
        previousKey = key;
      });
    }
    return value;
  }
}
