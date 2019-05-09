import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { actions } from '../../actions/types.actions';
import { switchMap } from 'rxjs/operators';
import { setMedicalCase } from '../../actions/creators.actions';
import { stringifyDeepRef } from '../../../src/utils/swissKnives';

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Loop on diagnostics AND PS
// TODO make PS change side effect
export const epicClassIntercept = (action$, state$) => {

  console.log(action$)

  return action$.pipe(
    ofType(actions.MC_SET),
    switchMap((action) => {
      // Index is the id of the node that has just been answered
      const { medicalCase } = action.payload;

      console.log(action, 'INTERCEPT ACTION !');

      return of();
    })
  );
}
