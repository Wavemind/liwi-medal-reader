// @flow

import moment from 'moment';
import { NodeModel } from './Node.model';
import { valueFormats, references } from '../../constants';
import { store } from '../../store';
import I18n from '../../../src/utils/i18n';

interface QuestionInterface {
  answer: string;
  answers: Object;
  description: string;
  label: string;
  category: string;
  counter: number;
  dd: Array<Object>;
  display_format: string;
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
      is_mandatory = '',
      qs = [],
      value = '',
      value_format = '',
      stage = '',
      formula = '',
      referenced_in = [],
      cc = [],
      reference_table_x_id = 0,
      reference_table_y_id = 0,
      reference_table_z_id = null,
      reference_table_male = '',
      reference_table_female = '',
      system = '',
      is_identifiable = false,
      is_triage = false,
      estimable = false,
      estimableValue = 'measured',
      min_value_warning = '',
      max_value_warning = '',
      min_value_error = '',
      max_value_error = '',
      min_message_warning = '',
      max_message_warning = '',
      min_message_error = '',
      max_message_error = '',
    } = props;

    this.description = description;
    this.label = label;
    this.answer = answer;
    this.answers = answers;
    this.category = category;
    this.counter = counter;
    this.dd = dd;
    this.display_format = display_format;
    this.is_mandatory = is_mandatory;
    this.qs = qs;
    this.value = value;
    this.value_format = value_format;
    this.stage = stage;
    this.formula = formula;
    this.referenced_in = referenced_in;
    this.cc = cc;
    this.reference_table_y_id = reference_table_y_id;
    this.reference_table_x_id = reference_table_x_id;
    this.reference_table_z_id = reference_table_z_id;
    this.reference_table_male = reference_table_male;
    this.reference_table_female = reference_table_female;
    this.system = system;
    this.is_identifiable = is_identifiable;
    this.is_triage = is_triage;
    this.min_value_warning = min_value_warning;
    this.max_value_warning = max_value_warning;
    this.min_value_error = min_value_error;
    this.max_value_error = max_value_error;
    this.min_message_warning = min_message_warning;
    this.max_message_warning = max_message_warning;
    this.min_message_error = min_message_error;
    this.max_message_error = max_message_error;
    this.validationMessage = null;
    this.validationType = null;
    this.estimable = estimable;

    // Add attribute for basic measurement question ex (weight, MUAC, height) to know if it's measured or estimated value answered
    // if (estimable) {
    if (estimable) {
      // Type available [measured, estimated]
      this.estimableValue = estimableValue;
    }
  }

  /**
   * Calculate condition to display triage question
   * @params medicalCase : object
   * @return isDisplayed : boolean
   */
  isDisplayedInTriage(medicalCase) {
    const { conditions } = medicalCase.triage;
    let isDisplayed = true;

    // Skip if there is no conditions
    if (conditions?.[this.id] !== undefined) {
      isDisplayed = false;
      conditions[this.id].map((condition) => {
        if (medicalCase.nodes[condition.complaint_category_id].answer === condition.answer_id) {
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
      const id = item.match(/\d/g).join('');

      // Get value of this node
      const nodeInBracket = state$.nodes[id];
      if (nodeInBracket.value === null || (nodeInBracket.value === 0 && nodeInBracket.answer === null)) {
        ready = false;
        return item;
      }
      switch (nodeInBracket.value_format) {
        case valueFormats.date:
          return moment().diff(moment(nodeInBracket.value).toDate(), item.search('ToMonth') > 0 ? 'months' : 'days');
        default:
          return nodeInBracket.value;
      }
    };
    // Replace every bracket in the formula with it's value
    const formula = this.formula.replace(findBracketId, replaceBracketToValue);
    if (ready) {
      console.log('########################################################');
      console.log(formula);
      return eval(formula);
    }
    return null;
  };

  /**
   * Calculate reference score.
   * @returns refer to reference tables
   */
  calculateReference() {
    const state$ = store.getState();
    console.log(this);
    // Get X and Y
    const questionX = state$.nodes[this.reference_table_x_id];
    const questionY = state$.nodes[this.reference_table_y_id];
    let questionZ = null;

    if (this.reference_table_z_id !== null) {
      questionZ = state$.nodes[this.reference_table_z_id];
    }

    // TODO: Remove when decision about date format is taken
    // TODO: If it's zscore question take format of date in days otherwise in months
    // TODO: Get days or months between today and X/Y value
    // const dateFormat = this.label === 'Weight for age (z-score)' ? 'days' : 'months';
    // x = x.display_format === displayFormats.date ? moment().diff(moment(x.value).toDate(), dateFormat) : x.value;
    // y = y.display_format === displayFormats.date ? moment().diff(moment(y.value).toDate(), dateFormat) : y.value;

    const x = questionX.value;
    const y = questionY.value;
    const z = questionZ?.value;
    const genderQuestion = state$.nodes[state$.config.basic_questions.gender_question_id];
    const gender = genderQuestion.answer !== null ? genderQuestion.answers[genderQuestion.answer].value : null;

    let reference = null;
    let value = null;
    let previousKey = null;

    // Get reference table for male or female
    if (gender === 'male') {
      reference = references[this.reference_table_male];
    } else if (gender === 'female') {
      reference = references[this.reference_table_female];
    }

    console.log('x :', x, 'y :', y, 'z :', z);
    console.log('gender', gender);
    console.log('reference', reference);

    //TODO: IMPROVE THIS SHIT

    // If X and Y means question is not answered + check if answer is in the scope of the reference table
    if (reference !== null && x !== null && y !== null && x in reference) {
      if (z === null) {
        // Order the keys
        const arr = Object.keys(reference[x]).sortByNumber();

        // if value smaller than smallest element return the smaller value
        if (reference[x][arr.first()] > y) {
          return arr.first();
        }
        if (reference[x][arr.last()] < y) {
          return arr.last();
        }

        arr.map((key) => {
          if (reference[x][key] > y) {
            value = Number(previousKey);
            return true;
          }
          previousKey = key;
        });
      } else if (String(y) in reference[x]) {
        // Order the keys
        const zArray = Object.keys(reference[x][y]).sortByNumber();

        // if value smaller than smallest element return the smaller value
        if (reference[x][y][zArray.first()] > z) {
          return zArray.first();
        }
        if (reference[x][y][zArray.last()] < z) {
          return zArray.last();
        }

        zArray.map((key) => {
          if (reference[x][y][key] > z) {
            value = Number(previousKey);
            return true;
          }
          previousKey = key;
        });
      }
    }

    return value;
  }

  displayValue = () => {
    if (this.value_format === valueFormats.date && this.value !== null) {
      return moment(this.value).format(I18n.t('application:date_format'));
    }
    return this.value === null ? '' : this.value;
  };
}
