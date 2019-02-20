import { ofType } from 'redux-observable';
import { mapTo, delay, concatMap, mergeMap } from 'rxjs/operators';
import { middlewareTest, addTodo } from '../../actions/creators.actions';

export const fetchUserEpic = (action$) =>
  action$.pipe(
    ofType('actionshere'),
    // delay(1000), // Asynchronously wait 1000ms then continue
    mapTo(addTodo('tt'))
  );
