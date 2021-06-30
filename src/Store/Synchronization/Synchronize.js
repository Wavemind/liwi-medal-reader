import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { SynchronizeService } from '@/Services/Synchronization'

export default {
  initialState: buildAsyncState('synchronize'),
  action: buildAsyncActions('synchronization/synchronize', SynchronizeService),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'synchronize.error',
    loadingKey: 'synchronize.loading',
  }),
}
