import { ofType } from 'redux-observable';
import { mapTo } from 'rxjs/operators';
import { actions } from '../../actions/types.actions';

export const pingEpic = (action$) => {
  return action$.pipe(
    ofType(actions.MEDICAL_CASE_SET),
    mapTo({ type: 'INTERCEPT_ACTIONS' })
  );
};
