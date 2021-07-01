import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import ValidationStepService from '@/Services/Validation/Step'

export default {
  initialState: buildAsyncState('step'),
  action: buildAsyncActions('validation/step', ValidationStepService),
  reducers: buildAsyncReducers({
    errorKey: 'step.error',
    loadingKey: 'step.loading',
  }),
}
