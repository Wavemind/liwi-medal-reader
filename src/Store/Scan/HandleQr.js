import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { HandleQrService } from '@/Services/Scan'

export default {
  initialState: buildAsyncState('handleQr'),
  action: buildAsyncActions('scan/handleQr', HandleQrService),
  reducers: buildAsyncReducers({
    errorKey: 'handleQr.error',
    loadingKey: 'handleQr.loading',
  }),
}
