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
import { GetAllPatientsWithConsentService } from '@/Services/Patient'

export default {
  initialState: {
    getAllWithConsent: {
      item: { data: [], isLastBatch: false },
      loading: false,
      error: null,
    },
  },
  action: buildAsyncActions(
    'databasePatient/getAllWithConsent',
    GetAllPatientsWithConsentService,
  ),
  reducers: buildAsyncReducers({
    itemKey: 'getAllWithConsent.item',
    errorKey: 'getAllWithConsent.error',
    loadingKey: 'getAllWithConsent.loading',
  }),
}
