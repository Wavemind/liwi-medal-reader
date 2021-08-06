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
import UnlockMedicalCaseService from '@/Services/MedicalCase/Unlock'

export default {
  initialState: buildAsyncState('unlock'),
  action: buildAsyncActions(
    'databaseMedicalCase/unlock',
    UnlockMedicalCaseService,
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'unlock.error',
    loadingKey: 'unlock.loading',
  }),
}
