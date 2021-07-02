import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { ResetAssessmentsService } from '@/Services/MedicalCase'

export default {
  initialState: buildAsyncState('resetAssessments'),
  action: buildAsyncActions(
    'medicalCase/resetAssessments',
    ResetAssessmentsService,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'resetAssessments.error',
    loadingKey: 'resetAssessments.loading',
  }),
}
