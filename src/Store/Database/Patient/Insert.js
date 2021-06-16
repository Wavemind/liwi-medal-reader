/**
 * The external imports
 */
import {
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

/**
 * The internal imports
 */
import insertPatientService from '@/Services/Patient/Insert'

export default {
  initialState: {
    patient: {
      insert: {
        item: {},
        loading: false,
        error: null,
      },
    },
  },
  action: buildAsyncActions('database/patient/insert', insertPatientService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'patient.insert.error',
    loadingKey: 'patient.insert.loading',
  }),
}