import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import ResetAssessments from '@/Services/MedicalCase/ResetAssessments'

export default {
  initialState: buildAsyncState('resetAssessments'),
  action: buildAsyncActions('medicalCase/resetAssessments', ResetAssessments),
  reducers: buildAsyncReducers({
    errorKey: 'resetAssessments.error',
    loadingKey: 'resetAssessments.loading',
  }),
}
