import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { MedicalHistoryQuestions } from '@/Services/Steps'

export default {
  initialState: buildAsyncState('medicalHistory'),
  action: buildAsyncActions(
    'questionsPerSystem/medicalHistory',
    MedicalHistoryQuestions,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'medicalHistory.error',
    loadingKey: 'medicalHistory.loading',
  }),
}
