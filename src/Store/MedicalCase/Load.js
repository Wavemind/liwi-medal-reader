import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { LoadMedicalCaseService } from '@/Services/MedicalCase'

export default {
  initialState: buildAsyncState('load'),
  action: buildAsyncActions('medicalCase/load', LoadMedicalCaseService),
  reducers: buildAsyncReducers({
    errorKey: 'load.error',
    loadingKey: 'load.loading',
  }),
}
