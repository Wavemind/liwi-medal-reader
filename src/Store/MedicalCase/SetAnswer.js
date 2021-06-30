import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { SetAnswerService } from '@/Services/MedicalCase'

export default {
  initialState: buildAsyncState('setAnswer'),
  action: buildAsyncActions('medicalCase/setAnswer', SetAnswerService),
  reducers: buildAsyncReducers({
    errorKey: 'setAnswer.error',
    loadingKey: 'setAnswer.loading',
  }),
}
