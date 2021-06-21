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
import SavePatientValuesService from '@/Services/PatientValues/Save'

export default {
  initialState: buildAsyncState('save'),
  action: buildAsyncActions(
    'databasePatientValues/save',
    SavePatientValuesService,
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'save.error',
    loadingKey: 'save.loading',
  }),
}
