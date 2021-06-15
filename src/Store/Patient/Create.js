import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import CreateService from '@/Services/Patient/Create'

export default {
  initialState: buildAsyncState('create'),
  action: buildAsyncActions('patient/create', CreateService),
  reducers: buildAsyncReducers({
    errorKey: 'create.error',
    loadingKey: 'create.loading',
  }),
}
