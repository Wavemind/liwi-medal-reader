// @flow
import findKey from 'lodash/findKey';
import { nodesType, valueFormats } from '../../constants';
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
   *
   * @param value: [Number || String] : new value for the question
   * Depending the value format of the question
   *
   * @Float If float we find the right operator and calculate the new value
   *
   * @List If list or array set the new value defined by the component button
   *
   */
  updateAnswer = (value) => {
    let answer;

    switch (this?.value_format) {
      case valueFormats.int:
      case valueFormats.float:
        answer = findKey(this?.answers, (answerCondition) => {
          switch (answerCondition.operator) {
            case 'more_or_equal':
              return value >= Number(answerCondition.value);

            case 'less':
              return value < Number(answerCondition.value);

            case 'between':
              return (
                value >= Number(answerCondition.value.split(',').first()) &&
                value < Number(answerCondition.value.split(',')[1])
              );
          }
        });
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

    // Assign final value
    this.answer = answer;
    this.value = value;
  };
}
