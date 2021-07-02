import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import CreatePatientService from '@/Services/Patient/Create'

export default {
  initialState: buildAsyncState('create'),
  action: buildAsyncActions('patient/create', CreatePatientService),
  reducers: buildAsyncReducers({
    errorKey: 'create.error',
    loadingKey: 'create.loading',
  }),
}
