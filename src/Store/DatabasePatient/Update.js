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
import { UpdatePatientService } from '@/Services/Patient'

export default {
  initialState: buildAsyncState('update'),
  action: buildAsyncActions('databasePatient/update', UpdatePatientService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'update.error',
    loadingKey: 'update.loading',
  }),
}
