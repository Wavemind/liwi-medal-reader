import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { PhysicalExamQuestionsService } from '@/Services/Steps'

export default {
  initialState: buildAsyncState('physicalExam'),
  action: buildAsyncActions(
    'questionsPerSystem/physicalExam',
    PhysicalExamQuestionsService,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'physicalExam.error',
    loadingKey: 'physicalExam.loading',
  }),
}
