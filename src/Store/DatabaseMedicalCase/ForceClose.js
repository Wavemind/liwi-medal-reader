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
import ForceCloseMedicalCaseService from '@/Services/MedicalCase/ForceClose'

export default {
  initialState: buildAsyncState('forceClose'),
  action: buildAsyncActions(
    'databaseMedicalCase/forceClose',
    ForceCloseMedicalCaseService,
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'forceClose.error',
    loadingKey: 'forceClose.loading',
  }),
}
