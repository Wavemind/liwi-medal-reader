import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { NewSessionUserService } from '@/Services/User'

export default {
  initialState: buildAsyncState('newSession'),
  action: buildAsyncActions('user/newSession', NewSessionUserService),
  reducers: buildAsyncReducers({
    errorKey: 'newSession.error',
    loadingKey: 'newSession.loading',
  }),
}
