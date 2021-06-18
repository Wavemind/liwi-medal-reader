import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import SetDiagnoses from '@/Services/MedicalCase/SetDiagnoses'

export default {
  initialState: buildAsyncState('setDiagnoses'),
  action: buildAsyncActions('medicalCase/setDiagnoses', SetDiagnoses),
  reducers: buildAsyncReducers({
    errorKey: 'setDiagnoses.error',
    loadingKey: 'setDiagnoses.loading',
  }),
}
