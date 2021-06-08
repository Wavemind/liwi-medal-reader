import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { Load } from '@/Services/Patient'

export default {
  initialState: buildAsyncState('load'),
  action: buildAsyncActions('patient/load', Load),
  reducers: buildAsyncReducers({
    errorKey: 'load.error',
    loadingKey: 'load.loading',
  }),
}
