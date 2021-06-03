import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import Create from '@/Services/MedicalCase/Create'

export default {
  initialState: buildAsyncState('create'),
  action: buildAsyncActions('medicalCase/create', Create),
  reducers: buildAsyncReducers({
    errorKey: 'create.error',
    loadingKey: 'create.loading',
  }),
}
