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
import HandleDateFormulasService from '@/Services/MedicalCase/HandleDateFormulas'

export default {
  initialState: buildAsyncState('handleDateFormulas'),
  action: buildAsyncActions(
    'medicalCase/handleDateFormulas',
    HandleDateFormulasService,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'handleDateFormulas.error',
    loadingKey: 'handleDateFormulas.loading',
  }),
}
