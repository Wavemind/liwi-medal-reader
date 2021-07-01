import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { DestroySessionUserService } from '@/Services/User'

export default {
  initialState: buildAsyncState('destroySession'),
  action: buildAsyncActions('user/destroySession', DestroySessionUserService),
  reducers: buildAsyncReducers({
    errorKey: 'destroySession.error',
    loadingKey: 'destroySession.loading',
  }),
}
