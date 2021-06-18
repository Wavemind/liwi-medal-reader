import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import ValidationStep from '@/Services/Validation/Step'

export default {
  initialState: buildAsyncState('step'),
  action: buildAsyncActions('validation/step', ValidationStep),
  reducers: buildAsyncReducers({
    errorKey: 'step.error',
    loadingKey: 'step.loading',
  }),
}
