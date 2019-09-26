import { setAnswer } from '../actions/creators.actions';

/**
 * Handle whether this answer of a question should be dispatched in the reducer or sent in the props
 * based on the value of method.
 *
 * The answer is sent in the reducer if the medical case already exists.
 * The answer is set in the props if we are creating a new patient
 *
 * @param index [Number] : Index of the  questions
 * @param value [Number || String ] : New value of the question
 * @param dispatch [Func] : Function from redux for dispatch action
 * @param props [Func] : FUnction callback provided by parent component
 * @return {Func}
 */
export const manageSetAnswer = (index, value, dispatch, props) => {
  const { method = 'redux' } = props;
  if (method === 'redux') {
    return dispatch(setAnswer(index, value));
  } else if (method === 'props') {
    return props?.onChange(index, value);
  }
};
