import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { NewSessionAuthService } from '@/Services/Auth'

export default {
  initialState: buildAsyncState('newSession'),
  action: buildAsyncActions('auth/newSession', NewSessionAuthService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'newSession.error',
    loadingKey: 'newSession.loading',
  }),
}
