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
import updateMedicalCaseService from '@/Services/MedicalCase/Update'

export default {
  initialState: buildAsyncState('update'),
  action: buildAsyncActions(
    'databaseMedicalCase/update',
    updateMedicalCaseService,
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'update.error',
    loadingKey: 'update.loading',
  }),
}
