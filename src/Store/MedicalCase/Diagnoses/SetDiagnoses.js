import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { SetDiagnosesService } from '@/Services/MedicalCase'

export default {
  initialState: buildAsyncState('setDiagnoses'),
  action: buildAsyncActions('medicalCase/setDiagnoses', SetDiagnosesService),
  reducers: buildAsyncReducers({
    errorKey: 'setDiagnoses.error',
    loadingKey: 'setDiagnoses.loading',
  }),
}
