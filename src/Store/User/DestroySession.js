import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import destroySessionUserService from '@/Services/User/DestroySession'

export default {
  initialState: buildAsyncState('destroySession'),
  action: buildAsyncActions('user/destroySession', destroySessionUserService),
  reducers: buildAsyncReducers({
    errorKey: 'destroySession.error',
    loadingKey: 'destroySession.loading',
  }),
}
