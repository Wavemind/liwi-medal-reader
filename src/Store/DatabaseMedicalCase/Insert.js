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
import InsertMedicalCaseService from '@/Services/MedicalCase/Insert'

export default {
  initialState: buildAsyncState('insert'),
  action: buildAsyncActions(
    'databaseMedicalCase/insert',
    InsertMedicalCaseService,
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'insert.error',
    loadingKey: 'insert.loading',
  }),
}
