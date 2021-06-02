import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import handleQrService from '@/Services/Scan/HandleQr'

export default {
  initialState: buildAsyncState('handleQr'),
  action: buildAsyncActions('scan/handleQr', handleQrService),
  reducers: buildAsyncReducers({
    errorKey: 'handleQr.error',
    loadingKey: 'handleQr.loading',
  }),
}
