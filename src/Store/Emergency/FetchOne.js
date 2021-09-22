/**
 * The external imports
 */
import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

/**
 * The internal imports
 */
import { FetchOneEmergencyService } from '@/Services/Emergency'

export default {
  initialState: buildAsyncState('emergency'),
  action: buildAsyncActions('emergency/fetchOne', FetchOneEmergencyService),
  reducers: buildAsyncReducers({
    errorKey: 'emergency.error',
    loadingKey: 'emergency.loading',
  }),
}
