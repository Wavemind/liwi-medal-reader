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
import { UpdatePatientValuesService } from '@/Services/PatientValues'

export default {
  initialState: buildAsyncState('update'),
  action: buildAsyncActions(
    'databasePatientValues/update',
    UpdatePatientValuesService,
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'update.error',
    loadingKey: 'update.loading',
  }),
}
