import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'
import registerDeviceService from '@/Services/Device/Register'

export default {
  initialState: buildAsyncState('register'),
  action: buildAsyncActions('device/register', registerDeviceService),
  reducers: buildAsyncReducers({
    errorKey: 'register.error',
    loadingKey: 'register.loading',
  }),
}
