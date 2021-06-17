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
    insert: {
      item: {},
      loading: false,
      error: null,
    },
  },
  action: buildAsyncActions('databasePatient/insert', insertPatientService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'insert.error',
    loadingKey: 'insert.loading',
  }),
}
