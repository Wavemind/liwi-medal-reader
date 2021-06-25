import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import PhysicalExam from '@/Services/Steps/PhysicalExam'

export default {
  initialState: buildAsyncState('physicalExam'),
  action: buildAsyncActions('questionsPerSystem/physicalExam', PhysicalExam),
  reducers: buildAsyncReducers({
    errorKey: 'physicalExam.error',
    loadingKey: 'physicalExam.loading',
  }),
}
