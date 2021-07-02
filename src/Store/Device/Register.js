import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'
import { RegisterDeviceService } from '@/Services/Device'

export default {
  initialState: buildAsyncState('register'),
  action: buildAsyncActions('device/register', RegisterDeviceService),
  reducers: buildAsyncReducers({
    errorKey: 'register.error',
    loadingKey: 'register.loading',
  }),
}
