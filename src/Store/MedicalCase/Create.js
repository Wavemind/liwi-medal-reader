import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import CreateMedicalCaseService from '@/Services/MedicalCase/Create'

export default {
  initialState: buildAsyncState('create'),
  action: buildAsyncActions('medicalCase/create', CreateMedicalCaseService),
  reducers: buildAsyncReducers({
    errorKey: 'create.error',
    loadingKey: 'create.loading',
  }),
}
