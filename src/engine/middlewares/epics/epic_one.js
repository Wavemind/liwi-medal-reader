import { ofType } from 'redux-observable';
import { mapTo } from 'rxjs/operators';

export const pingEpic = (action$) =>
  action$.pipe(
    ofType('ss'),
    mapTo({ type: 'PONG' })
  );
