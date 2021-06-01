import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import handleQrService from '@/Services/MedicalCase/'

export default {
  initialState: buildAsyncState('create'),
  action: buildAsyncActions('medicalCase/create', handleQrService),
  reducers: buildAsyncReducers({
    errorKey: 'create.error',
    loadingKey: 'create.loading',
  }),
}
