import { ofType } from 'redux-observable';
import { mapTo } from 'rxjs/operators';

export const fetchUserEpic = (action$) =>
  action$.pipe(
    ofType('fff'),
    mapTo({ type: 'PONG2' })
  );
