import { setAnswer } from '../actions/creators.actions';

/**
 * Special and universal function for return an action redux OR on props call back function
 *
 * @param index [Number] : Index of the  questions
 * @param value [Number || String ] : New value of the question
 * @param dispatch [Func] : Function from redux for dispatch action
 * @param props [Func] : FUnction callback provided by parent component
 * @return {Func}
 */
export const dispatcherOnChangeSetAnswer = (index, value, dispatch, props) => {
  const { method = 'redux' } = props;
  if (method === 'redux') {
    return dispatch(setAnswer(index, value));
  } else if (method === 'props') {
    return props?.onChange(index, value);
  }
};
