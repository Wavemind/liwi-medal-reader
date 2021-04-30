import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'
import newSessionAuthService from '@/Services/Auth/NewSession'

export default {
  initialState: buildAsyncState('newSession'),
  action: buildAsyncActions('auth/newSession', newSessionAuthService),
  reducers: buildAsyncReducers({
    errorKey: 'newSession.error', // Optionally, if you scoped variables, you can use a key with dot notation
    loadingKey: 'newSession.loading',
  }),
}
