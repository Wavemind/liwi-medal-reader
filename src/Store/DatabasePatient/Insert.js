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
import InsertPatientService from '@/Services/Patient/Insert'

export default {
  initialState: buildAsyncState('insert'),
  action: buildAsyncActions('databasePatient/insert', InsertPatientService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'insert.error',
    loadingKey: 'insert.loading',
  }),
}
