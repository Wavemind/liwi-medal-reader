// @flow
import NavigationService from 'engine/navigation/Navigation.service';

import findKey from 'lodash/findKey';
import { View } from 'react-native';
import { Text } from 'native-base';
import React from 'react';
import { categories, valueFormats } from '../../constants';
import { MedicalCaseModel } from './MedicalCase.model';
import { styles } from '../../../src/components/QuestionsContainer/QuestionFactory/Question.factory.style';

interface NodeInterface {
  id: number;
  type: string;
  reference: string;
  medicalCase: MedicalCaseModel;
}

export class NodeModel implements NodeInterface {
  constructor(props) {
    const { id = 0, type = '', reference = '' } = props;
    this.id = id;
    this.type = type;
    this.reference = reference;
  }

  /**
   * Update the answer depending his format
   *
   * @param {(string\|number)} value: new value for the question
   * @return  {Nothing} Update the class
   * Depending the value format of the question
   *
   * Float If float we find the right operator and calculate the new value
   *
   * List If list or array set the new value defined by the component button
   *
   */
  updateAnswer = (value) => {
    let answer = null;

    if (this.value_format === undefined) {
      return false;
    }

    if (this.category !== categories.basicMeasurement) {
      switch (this?.value_format) {
        case valueFormats.int:
        case valueFormats.float:
          if (value !== null) {
            answer = findKey(this?.answers, (answerCondition) => {
              switch (answerCondition.operator) {
                case 'more_or_equal':
                  return value >= Number(answerCondition.value);
                case 'less':
                  return value < Number(answerCondition.value);
                case 'between':
                  return value >= Number(answerCondition.value.split(',').first()) && value < Number(answerCondition.value.split(',').second());
              }
            });
            if (answer !== undefined) {
              answer = Number(answer);
            } else {
              answer = null;
            }
          } else {
            answer = null;
          }
          value = Number(value);
          break;
        case valueFormats.string:
        case valueFormats.date:
          //  Nothing to do
          break;
        case valueFormats.bool:
        case valueFormats.array:
        case valueFormats.present:
        case valueFormats.positive:
          // Set Number only if this is a number
          if (value !== null) {
            answer = Number(value);
          } else {
            // Set the new answer to null for reset
            answer = value;
          }
          value = null;
          break;
        default:
          // eslint-disable-next-line no-console
          console.log('%c --- DANGER --- ', 'background: #FF0000; color: #F6F3ED; padding: 5px', `Unhandled question format ${this.display_format}`, this);
          answer = value;
          break;
      }
    } else {
      answer = null;
    }

    // Validation for integer and float type based on Medal-C config
    if (this.value_format === valueFormats.int || this.value_format === valueFormats.float) {
      if ((value < this.min_value_warning || value > this.max_value_warning) && value !== null) {
        // Warning
        if (value < this.min_value_warning && this.min_value_warning !== null) {
          this.validationMessage = this.min_message_warning;
        }

        if (value > this.max_value_warning && this.max_value_warning !== null) {
          this.validationMessage = this.max_message_warning;
        }

        this.validationType = 'warning';

        // Error
        if (value < this.min_value_error || value > this.max_value_error) {
          if (value < this.min_value_error && this.min_value_error !== null) {
            this.validationMessage = this.min_message_error;
          }

          if (value > this.max_value_error && this.max_value_error !== null) {
            this.validationMessage = this.max_message_error;
          }
          this.validationType = 'error';
        }
      } else {
        this.validationMessage = null;
        this.validationType = null;
      }
    }

    // Assign final value
    this.answer = answer;
    this.answer_stage = NavigationService.getCurrentRoute().routeName;
    this.value = value;
  };

  displayValue = () => {
    return this.value;
  };
}
