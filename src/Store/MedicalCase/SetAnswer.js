import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import SetAnswer from '@/Services/MedicalCase/SetAnswer'

export default {
  initialState: buildAsyncState('setAnswer'),
  action: buildAsyncActions('medicalCase/setAnswer', SetAnswer),
  reducers: buildAsyncReducers({
    errorKey: 'setAnswer.error',
    loadingKey: 'setAnswer.loading',
  }),
}
