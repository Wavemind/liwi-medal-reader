import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { Load } from '@/Services/MedicalCase'

export default {
  initialState: buildAsyncState('load'),
  action: buildAsyncActions('medicalCase/load', Load),
  reducers: buildAsyncReducers({
    errorKey: 'load.error',
    loadingKey: 'load.loading',
  }),
}
