import {
  buildAsyncState,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import { createAction } from '@reduxjs/toolkit'

import SetAnswer from '@/Services/MedicalCase/SetAnswer'

export default {
  initialState: buildAsyncState('setAnswer'),
  action: createAction('medicalCase/setAnswer', SetAnswer),
  reducers: buildAsyncReducers({
    errorKey: 'setAnswer.error',
    loadingKey: 'setAnswer.loading',
  }),
}
