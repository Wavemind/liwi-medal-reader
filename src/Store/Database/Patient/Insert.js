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
import insertPatientService from '@/Services/Patient/Insert'

export default {
  initialState: { patient: { ...buildAsyncState('insert') } },
  action: buildAsyncActions('database/patient/insert', insertPatientService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'patient.insert.error',
    loadingKey: 'patient.insert.loading',
  }),
}
