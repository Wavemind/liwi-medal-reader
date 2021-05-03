import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import newSessionUserService from '@/Services/User/NewSession'

export default {
  initialState: buildAsyncState('newSession'),
  action: buildAsyncActions('user/newSession', newSessionUserService),
  reducers: buildAsyncReducers({
    errorKey: 'newSession.error',
    loadingKey: 'newSession.loading',
  }),
}
