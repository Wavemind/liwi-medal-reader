import findKey from 'lodash/findKey';
import { valueFormats } from '../constants';
import { setAnswer } from '../actions/creators.actions';

export const updaterAnswer = (node, value) => {
  let answer;
  switch (node.value_format) {
    case valueFormats.int:
    case valueFormats.float:
      answer = findKey(node.answers, (answerCondition) => {
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
    case valueFormats.array:
      answer = value;
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(
        '%c --- DANGER --- ',
        'background: #FF0000; color: #F6F3ED; padding: 5px',
        `Unhandled question format ${node.display_format}`,
        node
      );
      answer = value;
      break;
  }

  // Return new variable merge betwwen old node and new data
  return {
    ...node,
    answer: answer,
    value: value,
  };
};

export const dispatcherOnChangeSetAnswer = (index, value, dispatch, props) => {
  const { method = 'redux' } = props;
  if (method === 'redux') {
    return dispatch(setAnswer(index, value));
  } else if (method === 'props') {


    return props?.onChange(index, value);
  }
};
