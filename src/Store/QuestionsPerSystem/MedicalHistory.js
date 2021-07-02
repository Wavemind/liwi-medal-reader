import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { MedicalHistoryQuestionsService } from '@/Services/Steps'

export default {
  initialState: buildAsyncState('medicalHistory'),
  action: buildAsyncActions(
    'questionsPerSystem/medicalHistory',
    MedicalHistoryQuestionsService,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'medicalHistory.error',
    loadingKey: 'medicalHistory.loading',
  }),
}
