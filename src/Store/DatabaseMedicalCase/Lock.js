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
import LockMedicalCaseService from '@/Services/MedicalCase/Lock'

export default {
  initialState: buildAsyncState('lock'),
  action: buildAsyncActions('databaseMedicalCase/lock', LockMedicalCaseService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'lock.error',
    loadingKey: 'lock.loading',
  }),
}
