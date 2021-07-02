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
import InsertPatientValuesService from '@/Services/PatientValues/Insert'

export default {
  initialState: buildAsyncState('insert'),
  action: buildAsyncActions(
    'databasePatientValues/insert',
    InsertPatientValuesService,
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'insert.error',
    loadingKey: 'insert.loading',
  }),
}
