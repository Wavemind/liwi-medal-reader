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
import insertActivityService from '@/Services/Activity/Insert'

export default {
  initialState: buildAsyncState('insert'),
  action: buildAsyncActions('databaseActivity/insert', insertActivityService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'insert.error',
    loadingKey: 'insert.loading',
  }),
}
