import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import CreateService from '@/Services/Patient/Create'

export default {
  initialState: buildAsyncState('handleQr'),
  action: buildAsyncActions('patient/create', CreateService),
  reducers: buildAsyncReducers({
    errorKey: 'handleQr.error',
    loadingKey: 'handleQr.loading',
  }),
}
