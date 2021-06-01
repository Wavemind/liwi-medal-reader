import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import create from '@/Services/MedicalCase/create'

export default {
  initialState: buildAsyncState('create'),
  action: buildAsyncActions('medicalCase/create', create),
  reducers: buildAsyncReducers({
    errorKey: 'create.error',
    loadingKey: 'create.loading',
  }),
}
