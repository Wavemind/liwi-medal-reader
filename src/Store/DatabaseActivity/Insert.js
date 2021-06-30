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
import { InsertActivitiesService } from '@/Services/Activity'

export default {
  initialState: buildAsyncState('insert'),
  action: buildAsyncActions('databaseActivity/insert', InsertActivitiesService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'insert.error',
    loadingKey: 'insert.loading',
  }),
}
