import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { PhysicalExamQuestions } from '@/Services/Steps'

export default {
  initialState: buildAsyncState('physicalExam'),
  action: buildAsyncActions(
    'questionsPerSystem/physicalExam',
    PhysicalExamQuestions,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'physicalExam.error',
    loadingKey: 'physicalExam.loading',
  }),
}
