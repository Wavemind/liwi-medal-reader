import { ofType } from 'redux-observable';
import { mapTo } from 'rxjs/operators';
import { addTodo } from '../../actions/creators.actions';

export const fetchUserEpic = (action$) =>
  action$.pipe(
    ofType('actionshere'),
    // delay(1000), // Asynchronously wait 1000ms then continue
    mapTo(addTodo('tt'))
  );
