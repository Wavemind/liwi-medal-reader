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
import { FetchOneAlgorithmService } from '@/Services/Algorithm'

export default {
  initialState: buildAsyncState('fetchOne'),
  action: buildAsyncActions('algorithm/fetchOne', FetchOneAlgorithmService),
  reducers: buildAsyncReducers({
    errorKey: 'fetchOne.error',
    loadingKey: 'fetchOne.loading',
  }),
}
