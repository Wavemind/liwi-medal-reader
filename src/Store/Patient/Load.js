import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { LoadPatientService } from '@/Services/Patient'

export default {
  initialState: buildAsyncState('load'),
  action: buildAsyncActions('patient/load', LoadPatientService),
  reducers: buildAsyncReducers({
    errorKey: 'load.error',
    loadingKey: 'load.loading',
  }),
}
