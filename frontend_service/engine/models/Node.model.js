// @flow
import findKey from 'lodash/findKey';
import { categories, nodesType, valueFormats } from '../../constants';
import { MedicalCaseModel } from './MedicalCase.model';

const { qs, d, fd, m, q, t } = nodesType;

interface NodeInterface {
  id: number;
  type: qs | d | fd | m | q | t;
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
    let answer;

    if (this.value_format === undefined) {
      return false;
    }

    if (this.category !== categories.vitalSign) {
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
                  return (
                    value >= Number(answerCondition.value.split(',').first()) &&
                    value < Number(answerCondition.value.split(',').second())
                  );
              }
            });
          } else {
            answer = null;
          }
          break;
        case valueFormats.bool:
          answer = value;
          break;
        case valueFormats.array:
          answer = value;
          break;
        default:
          // eslint-disable-next-line no-console
          console.log(
            '%c --- DANGER --- ',
            'background: #FF0000; color: #F6F3ED; padding: 5px',
            `Unhandled question format ${this.display_format}`,
            this
          );
          answer = value;
          break;
      }
    } else {
      answer = null;
    }

    // Assign final value
    this.answer = answer;
    this.value = value;
  };
}
